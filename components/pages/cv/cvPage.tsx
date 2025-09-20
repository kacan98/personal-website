"use client";
import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/model";
import { MotivationalLetterResponse } from "@/app/api/motivational-letter/motivational-letter.model";
import PageWrapper from "@/components/pages/pageWrapper";
import Print from "@/components/print";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { initCv } from "@/redux/slices/cv";
import CreateIcon from '@mui/icons-material/Create';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  SelectChangeEvent,
  Slider,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import Button from "@/components/ui/Button";
import jsPDF from "jspdf";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useCvTools } from "./hooks/useCvTools";
import { useRefineCv } from "./hooks/useRefineCv";
import CvPaper from "./paper/cvPaper";
import { useTranslations } from 'next-intl';
import CvSidebar from "./CvSidebar";
import ExtensionDownload from "./ExtensionDownload";
import ManualAdjustmentModal from "./modals/ManualAdjustmentModal";
import MotivationalLetterModal from "./modals/MotivationalLetterModal";
import TranslationModal from "./modals/TranslationModal";
import PositionAnalysisModal from "./modals/PositionAnalysisModal";
import { CVSettings } from "@/types";
import { deepClone } from "./utils/cvDiffTracker";
import { getCvSettings } from "@/data";
import { ensureCvIds } from "@/utils/cvIds";
import { useLocale } from 'next-intl';
import { useCvDiffAnalysis } from "./utils/cvDiffAnalyzer";
import { useAuth } from '@/contexts/AuthContext';
import PasswordModal from '@/components/auth/PasswordModal';
import {
  setCurrentPosition,
  updateImprovementDescription,
  toggleImprovementSelection,
  selectSelectedImprovements,
  selectImprovementsWithDescriptions,
  markImprovementsAsUsed
} from '@/redux/slices/improvementDescriptions';

export type CvProps = {
  jobDescription?: string
};

function CvPage({ jobDescription }: CvProps) {
  const t = useTranslations('cv');
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const reduxCvProps = useAppSelector((state) => state.cv);

  // Store original CV state using useState to trigger re-renders
  const [originalCv, setOriginalCv] = useState<CVSettings | null>(null);
  const [showDiff, setShowDiff] = useState(true); // Enable diff view by default
  const [loading, setLoading] = useState(false);

  // Authentication state - declare before any useEffect that uses it
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();

  // Only allow editing when auth is disabled OR when authenticated AND auth loading is complete
  // During auth loading, always show as not editable to prevent hydration mismatch
  const editable = !authLoading && isAuthenticated; // Always require authentication

  // Load original CV from data files and sync with Redux to ensure they match initially
  useEffect(() => {
    if (!originalCv) {
      try {
        const loadedOriginalCv = getCvSettings(locale);
        const cvWithIds = ensureCvIds(loadedOriginalCv);
        const clonedCv = deepClone(cvWithIds);

        // Set original CV for comparison
        setOriginalCv(clonedCv);

        // Ensure Redux state matches the original CV exactly on initial load
        // Only initialize if Redux CV is significantly different (not just from previous edits)
        if (!reduxCvProps.name || reduxCvProps.name !== cvWithIds.name) {
          dispatch(initCv(cvWithIds));
        }
      } catch (error) {
        console.error('Failed to load original CV:', error);
      }
    }
  }, [locale]); // Only load once per locale

  // Authentication modal only shows when user clicks title 5 times (no auto-show)

  // Periodic auth status check (temporarily disabled - use manual refresh instead)
  // TODO: Re-enable if cross-tab authentication detection is needed
  // useEffect(() => {

  //   const interval = setInterval(async () => {
  //     if (!isAuthenticated) {
  //       // Only check if currently not authenticated
  //       try {
  //         const response = await fetch('/api/auth/status', {
  //           method: 'GET',
  //           credentials: 'include',
  //         });
  //         const data = await response.json();

  //         if (data.authenticated && !isAuthenticated) {
  //           // Authentication detected from another tab - refresh auth state
  //           window.location.reload();
  //         }
  //       } catch (error) {
  //         console.error('Periodic auth check failed:', error);
  //       }
  //     }
  //   }, 30000); // Check every 30 seconds (twice per minute)

  //   return () => clearInterval(interval);

  // Use Redux hasChanges flag instead of expensive diff analysis
  const hasChanges = reduxCvProps.hasChanges || false;

  // Always call the hook, but only compute when needed
  const cvDiffAnalysis = useCvDiffAnalysis(
    showDiff && originalCv ? originalCv : null,
    showDiff && originalCv ? reduxCvProps : null
  );
  const { removedSections, modifiedSections, removedSubSections, modifiedSubSections } = cvDiffAnalysis;

  // Don't auto-enable diff view - let user manually toggle it
  // The new personalized CV should be the primary view, not a diff
  // useEffect(() => {
  //   if (hasChanges && !showDiff && originalCv && !loading) {
  //     setShowDiff(true);
  //   }
  // }, [hasChanges, showDiff, originalCv, loading]);


  // Modal state
  const [manualAdjustmentModalOpen, setManualAdjustmentModalOpen] = useState(false);
  const [motivationalLetterModalOpen, setMotivationalLetterModalOpen] = useState(false);
  const [translationModalOpen, setTranslationModalOpen] = useState(false);
  const [positionAnalysisModalOpen, setPositionAnalysisModalOpen] = useState(false);
  const [extensionModalOpen, setExtensionModalOpen] = useState(false);

  // Existing state (simplified)
  const [selectedLanguage, setLanguage] = useState("English");
  const [snackbarMessage, setsnackbarMessage] = useState<string | null>(null);
  const [titleClickedTimes, setTitleClickedTimes] = useState(0);

  const [positionSummary, setPositionSummary] = useState<string>('')
  const [positionDetails, setPositionDetails] = useState<string>('')
  const [shouldAdjustCv, setShouldAdjustCv] = useState(false);
  const [positionIntersection, setPositionIntersection] = useState<JobCvIntersectionResponse | null>(null)
  // Use Redux for improvement descriptions
  const checked = useAppSelector(selectSelectedImprovements);
  const improvementsWithDescriptions = useAppSelector(selectImprovementsWithDescriptions);

  // Enhanced validation logic for refinement buttons
  const hasSelectedImprovements = checked.length > 0;
  const hasImprovementDescriptions = improvementsWithDescriptions.length > 0;
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [motivationalLetter, setMotivationalLetter] = useState<MotivationalLetterResponse | null>(null);
  const [editableMotivationalLetter, setEditableMotivationalLetter] = useState<MotivationalLetterResponse | null>(null);
  const [currentOperation, setCurrentOperation] = useState<string>(t('discussingWithAI'));
  const [cvAdjusted, setCvAdjusted] = useState(false);
  const [hasManualRefinements, setHasManualRefinements] = useState(false);
  const [_cacheStatusNotification, _setCacheStatusNotification] = useState<{
    show: boolean;
    fromCache: boolean;
  } | null>(null);
  const [lastCacheStatus, setLastCacheStatus] = useState<boolean | null>(null);
  const [cacheStats, setCacheStats] = useState<{ activeEntries: number } | null>(null);

  const [fontSize, setFontSize] = useState(12);

  // Refs for tracking job loading state
  const jobDescriptionReceived = useRef(false);
  const jobLoadingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Manual adjustments modal state
  const [isManualAdjustmentMinimized, setIsManualAdjustmentMinimized] = useState(false);
  const [manualOtherChanges, setManualOtherChanges] = useState("");
  const [localManualChanges, setLocalManualChanges] = useState("");
  const manualChangesDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined);


  // Cleanup manual changes timeout on unmount
  useEffect(() => {
    return () => {
      if (manualChangesDebounceRef.current) {
        clearTimeout(manualChangesDebounceRef.current);
      }
    };
  }, []);

  // Hooks
  const { getMotivationalLetter,
    adjustMotivationalLetter,
    adjustCvBasedOnPosition,
    updatePositionIntersection,
    translateCvWithoutLoading,
    translateLetterWithoutLoading,
    adjustSection } = useCvTools({
      reduxCvProps,
      positionDetails,
      positionSummary,
      positionIntersection,
      setLoading,
      setsnackbarMessage,
      setMotivationalLetter,
      setPositionIntersection,
      setPositionSummary,
      setCompanyName,
      setLanguage,
      setCacheStatus: (fromCache: boolean) => {
        _setCacheStatusNotification({ show: true, fromCache });
        setLastCacheStatus(fromCache); // Store for sidebar indicator
        fetchCacheStats(); // Refresh cache stats after AI operation
        // Auto-hide after 5 seconds
        setTimeout(() => {
          _setCacheStatusNotification(null);
        }, 5000);
      },
      extractedCompanyName: companyName
    })

  const { refineCv } = useRefineCv({
    originalCv: originalCv || reduxCvProps,
    currentCv: reduxCvProps,
    positionDetails,
    setsnackbarMessage,
    setLoading,
    setCurrentOperation,
  });


  const prettyfiedCompanyName = companyName ? `_${companyName.split(" ").join("_")}` : ''

  // These functions are no longer needed since we use computed diff analysis
  // Modifications are automatically detected by comparing original vs current CV state

  // Modal handlers
  const handleAdjustForPosition = async () => {
    if (positionDetails && positionDetails.trim().length > 0) {
    // Wait for auth loading to complete, then check authentication
    if (authLoading) {
      return; // Don't proceed while auth is still loading
    }

    if (!isAuthenticated) {
      setShowPasswordModal(true);
      return;
    }

      // Run CV adjustment and motivational letter generation in parallel
      setLoading(true);
      setCurrentOperation('Personalizing CV and generating motivational letter...');
      try {
        await Promise.all([
          adjustCvBasedOnPosition(),
          getMotivationalLetter(positionDetails, checked, selectedLanguage)
        ]);
        setsnackbarMessage('CV personalized and motivational letter generated successfully!');
        setCvAdjusted(true);
      } catch (error) {
        setsnackbarMessage('Error during CV personalization or letter generation');
      } finally {
        setLoading(false);
        setCurrentOperation('Discussing with AI...');
      }
    }
  };

  const handleManualRefinement = async (refinementData: {
    checkedImprovements: string[];
    improvementInputs: { [key: string]: string };
    missingSkills: string;
    otherChanges: string;
  }) => {
    // Include improvement descriptions from Redux store
    const refinementWithDescriptions = {
      ...refinementData,
      improvementInputs: {
        ...refinementData.improvementInputs,
        ...Object.fromEntries(
          improvementsWithDescriptions.map(item => [item.improvement, item.description])
        )
      }
    };

    await refineCv(refinementWithDescriptions);
    setHasManualRefinements(true);
    setManualAdjustmentModalOpen(false);

    // Mark the used improvements
    if (checked.length > 0) {
      dispatch(markImprovementsAsUsed(checked));
    }
  };

  const handleAdjustLetter = async (comments: string) => {
    const currentLetter = editableMotivationalLetter || motivationalLetter;
    if (currentLetter) {
      await adjustMotivationalLetter(
        currentLetter,
        comments,
        positionDetails,
        reduxCvProps,
        selectedLanguage
      );
    }
  };

  const handleTranslateBoth = async () => {
    setLoading(true);
    try {
      const hasLetter = !!(motivationalLetter || editableMotivationalLetter);
      let cvCompleted = false;
      let letterCompleted = false;

      const updateProgress = () => {
        if (hasLetter) {
          if (cvCompleted && letterCompleted) {
            setCurrentOperation('Translation completed! ✓');
          } else if (cvCompleted && !letterCompleted) {
            setCurrentOperation('CV translated ✓ - Translating motivational letter...');
          } else if (!cvCompleted && letterCompleted) {
            setCurrentOperation('Motivational letter translated ✓ - Translating CV...');
          } else {
            setCurrentOperation('Translating CV and motivational letter...');
          }
        } else {
          setCurrentOperation('Translating CV...');
        }
      };

      updateProgress();

      const promises = [];

      // CV translation promise
      const cvPromise = translateCvWithoutLoading({
        cvProps: reduxCvProps,
        selectedLanguage
      }).then((result) => {
        cvCompleted = true;
        updateProgress();
        return result;
      });

      promises.push(cvPromise);

      // Letter translation promise (only if letter exists)
      if (hasLetter) {
        const letterToTranslate = editableMotivationalLetter || motivationalLetter;
        if (letterToTranslate) {
          const letterPromise = translateLetterWithoutLoading({
            letter: letterToTranslate,
            selectedLanguage
          }).then((result) => {
            letterCompleted = true;
            updateProgress();
            setEditableMotivationalLetter(result);
            return result;
          });

          promises.push(letterPromise);
        }
      }

      await Promise.all(promises);

      if (hasLetter) {
        setsnackbarMessage(`CV and motivational letter translated to ${selectedLanguage}`);
      } else {
        setsnackbarMessage(`CV translated to ${selectedLanguage}`);
      }
    } catch (error) {
      setsnackbarMessage('Error during translation');
    } finally {
      setLoading(false);
      setCurrentOperation('Discussing with AI...');
    }
    setTranslationModalOpen(false);
  };

  // Effects
  // Check for job ID in URL and start loading immediately
  useEffect(() => {
    const currentUrl = window.location.pathname;
    const jobIdMatch = currentUrl.match(/\/cv\/([^\/]+)$/);

    if (jobIdMatch && jobIdMatch[1]) {
      // Job ID detected in URL, start loading immediately
      setLoading(true);
      setCurrentOperation('Personalizing CV and generating motivational letter...');

      // Set a timeout to show failure toast if no job description comes within 10 seconds
      jobLoadingTimeout.current = setTimeout(() => {
        if (!jobDescriptionReceived.current) {
          setLoading(false);
          setCurrentOperation('Discussing with AI...');
          setsnackbarMessage('Failed to load job description. Please try again.');
        }
      }, 10000);
    }

    return () => {
      if (jobLoadingTimeout.current) {
        clearTimeout(jobLoadingTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (jobDescription && jobDescription.trim().length > 0) {
      // Mark that we received job description
      jobDescriptionReceived.current = true;

      // Clear the failure timeout
      if (jobLoadingTimeout.current) {
        clearTimeout(jobLoadingTimeout.current);
        jobLoadingTimeout.current = null;
      }

      setPositionDetails(jobDescription);
      setShouldAdjustCv(true);
      // Don't clear loading state here - let handleAdjustForPosition manage it
    }
  }, [jobDescription]);

  useEffect(() => {
    if (shouldAdjustCv && positionDetails && positionDetails.trim().length > 0) {
      // Wait for auth loading to complete before checking authentication
      if (authLoading) {
        return; // Don't proceed while auth is still loading
      }

      // Check authentication before automatically adjusting CV
      if (!isAuthenticated) {
        setShowPasswordModal(true);
        setLoading(false); // Stop the loading spinner
        setCurrentOperation('Discussing with AI...');
        return;
      }
      handleAdjustForPosition();
    }
  }, [positionDetails, shouldAdjustCv, isAuthenticated, authLoading]);

  useEffect(() => {
    if (snackbarMessage === 'CV transformed') {
      setCvAdjusted(true);
    }
  }, [snackbarMessage]);

  useEffect(() => {
    if (motivationalLetter) {
      setEditableMotivationalLetter(motivationalLetter);
    }
  }, [motivationalLetter]);

  // Handle position updates with Redux
  useEffect(() => {
    if (positionDetails && positionDetails.trim().length > 10 && companyName) {
      dispatch(setCurrentPosition({
        positionDetails,
        companyName
      }));
    }
  }, [positionDetails, companyName, dispatch]);


  // Utility functions
  const handleLanguageChange = async (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setsnackbarMessage(null);
  };

  const onTitleClicked = () => {
    // Always require authentication - show password modal after 5 clicks
    if (!isAuthenticated && !showPasswordModal) {
      const newClickCount = titleClickedTimes + 1;
      setTitleClickedTimes(newClickCount);

      if (newClickCount >= 5) {
        setTitleClickedTimes(0); // Reset click counter when opening modal
        setShowPasswordModal(true);
      }
    }
  }

  const handleChecked = (value: string) => () => {
    dispatch(toggleImprovementSelection(value));
  }

  const handleImprovementDescriptionChange = (improvementKey: string, description: string) => {
    dispatch(updateImprovementDescription({
      improvementKey,
      userDescription: description,
      selected: checked.includes(improvementKey)
    }));
  }

  const handleCopyJsonToClipboard = async () => {
    try {
      const jsonData = JSON.stringify(reduxCvProps, null, 2);
      await navigator.clipboard.writeText(jsonData);
      setsnackbarMessage(t('jsonCopiedSuccess'));
    } catch (error) {
      setsnackbarMessage(t('jsonCopiedError'));
    }
  };

  const downloadMotivationalLetterPDF = () => {
    const letterToUse = editableMotivationalLetter || motivationalLetter;
    if (!letterToUse) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - 2 * margin;
    let currentY = 30;

    // Set font
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    // Helper function to handle Czech characters for PDF compatibility
    const processCzechText = (text: string): string => {
      return text
        .replace(/č/g, 'c').replace(/Č/g, 'C')
        .replace(/ř/g, 'r').replace(/Ř/g, 'R')
        .replace(/š/g, 's').replace(/Š/g, 'S')
        .replace(/ž/g, 'z').replace(/Ž/g, 'Z')
        .replace(/ý/g, 'y').replace(/Ý/g, 'Y')
        .replace(/á/g, 'a').replace(/Á/g, 'A')
        .replace(/é/g, 'e').replace(/É/g, 'E')
        .replace(/í/g, 'i').replace(/Í/g, 'I')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ú/g, 'u').replace(/Ú/g, 'U')
        .replace(/ů/g, 'u').replace(/Ů/g, 'U')
        .replace(/ď/g, 'd').replace(/Ď/g, 'D')
        .replace(/ť/g, 't').replace(/Ť/g, 'T')
        .replace(/ň/g, 'n').replace(/Ň/g, 'N');
    };

    // Helper function to add text with line breaks
    const addTextWithLineBreaks = (text: string, x: number, y: number, maxWidth?: number) => {
      const processedText = processCzechText(text);
      if (maxWidth) {
        const lines = pdf.splitTextToSize(processedText, maxWidth);
        pdf.text(lines, x, y);
        return lines.length * 5;
      } else {
        pdf.text(processedText, x, y);
        return 5;
      }
    };

    // Add all letter sections
    if (letterToUse.greeting) {
      const greetingHeight = addTextWithLineBreaks(letterToUse.greeting, margin, currentY, textWidth);
      currentY += greetingHeight + 6;
    }
    if (letterToUse.opening) {
      const openingHeight = addTextWithLineBreaks(letterToUse.opening, margin, currentY, textWidth);
      currentY += openingHeight + 6;
    }
    if (letterToUse.whyThisRole) {
      const whyThisRoleHeight = addTextWithLineBreaks(letterToUse.whyThisRole, margin, currentY, textWidth);
      currentY += whyThisRoleHeight + 6;
    }
    if (letterToUse.keyStrengths && letterToUse.keyStrengths.length > 0) {
      currentY += 3;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      addTextWithLineBreaks('Why I\'m a good fit:', margin, currentY);
      currentY += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      letterToUse.keyStrengths.forEach((strength) => {
        const bulletText = `• ${strength}`;
        const strengthHeight = addTextWithLineBreaks(bulletText, margin, currentY, textWidth);
        currentY += strengthHeight + 2;
      });
      currentY += 6;
    }
    if (letterToUse.uniqueValue) {
      const uniqueValueHeight = addTextWithLineBreaks(letterToUse.uniqueValue, margin, currentY, textWidth);
      currentY += uniqueValueHeight + 6;
    }
    if (letterToUse.closing) {
      const closingHeight = addTextWithLineBreaks(letterToUse.closing, margin, currentY, textWidth);
      currentY += closingHeight + 6;
    }
    if (letterToUse.signature) {
      addTextWithLineBreaks(letterToUse.signature, margin, currentY, textWidth);
    }

    const fileName = `Motivational_Letter${prettyfiedCompanyName || ''}.pdf`;
    pdf.save(fileName);
  };

  // Reset CV to original
  const handleResetToOriginal = () => {
    if (originalCv) {
      dispatch(initCv(originalCv)); // This automatically sets hasChanges to false
      setShowDiff(false); // Turn off diff view after reset
      // Clear any adjusted CV state
      setCvAdjusted(false);
      setPositionIntersection(null);
      setMotivationalLetter(null);
    }
  };

  // Fetch cache stats
  const fetchCacheStats = useCallback(async () => {
    try {
      const response = await fetch('/api/cache-stats');
      if (response.ok) {
        const stats = await response.json();
        setCacheStats(stats);
      }
    } catch (error) {
      console.error('Error fetching cache stats:', error);
    }
  }, []);

  // Fetch cache stats on component mount
  useEffect(() => {
    fetchCacheStats();
  }, [fetchCacheStats]);

  // Clear AI cache
  const handleClearCache = async () => {
    try {
      const response = await fetch('/api/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Cache cleared:', result);
        _setCacheStatusNotification(null); // Reset cache status when cache is cleared
        setLastCacheStatus(null); // Reset sidebar indicator
        fetchCacheStats(); // Refresh cache stats
        setsnackbarMessage('✅ Cache cleared successfully');
      } else {
        console.error('Failed to clear cache');
        setsnackbarMessage('❌ Failed to clear cache');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      setsnackbarMessage('❌ Error clearing cache');
    }
  };

  return (
    <PageWrapper title={t('pageTitle')} onTitleClicked={onTitleClicked} containerMaxWidth="md">
      <Box sx={{
        pb: manualAdjustmentModalOpen && isManualAdjustmentMinimized ? '200px' : 0,
        transition: 'padding-bottom 0.2s ease'
      }}>
      <>
        {/* Sidebar with action buttons */}
        <CvSidebar
          onAdjustForPosition={() => setManualAdjustmentModalOpen(true)}
          onManualAdjustments={() => {
            setManualAdjustmentModalOpen(true);
            setIsManualAdjustmentMinimized(true);
          }}
          onManualAdjustmentsQuick={() => {
            setManualAdjustmentModalOpen(true);
            setIsManualAdjustmentMinimized(true);
          }}
          onViewMotivationalLetter={() => setMotivationalLetterModalOpen(true)}
          onViewPositionAnalysis={() => setPositionAnalysisModalOpen(true)}
          onTranslate={() => setTranslationModalOpen(true)}
          hasMotivationalLetter={!!motivationalLetter}
          hasPositionAnalysis={!!positionIntersection}
          hasAdjustedCv={cvAdjusted}
          hasManualRefinements={hasManualRefinements}
          editable={editable}
          showDiff={showDiff}
          onToggleDiff={() => setShowDiff(!showDiff)}
          hasOriginalCv={!!originalCv}
          hasChanges={hasChanges}
          onResetToOriginal={handleResetToOriginal}
          onClearCache={cacheStats && cacheStats.activeEntries > 0 ? handleClearCache : undefined}
          lastCacheStatus={lastCacheStatus}
          onOpenExtensionModal={() => setExtensionModalOpen(true)}
        />

        {/* Extension Download Modal */}
        <ExtensionDownload open={extensionModalOpen} onClose={() => setExtensionModalOpen(false)} />

        {/* Logout button (when authenticated) */}
        {isAuthenticated && (
          <Tooltip title="Logout" placement="left">
            <IconButton
              onClick={async () => {
                await logout();
                setsnackbarMessage('Logged out successfully');
              }}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 80,
                zIndex: 998,
                backgroundColor: 'error.main',
                color: 'white',
                opacity: 0.7,
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 1,
                  backgroundColor: 'error.dark',
                },
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: 40,
                height: 40,
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* JSON copy button in bottom-right corner */}
        <Tooltip title={t('copyJsonTooltip')} placement="left">
          <IconButton
            onClick={handleCopyJsonToClipboard}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 998,
              backgroundColor: 'background.paper',
              color: 'text.secondary',
              opacity: 0.3,
              transition: 'opacity 0.2s',
              '&:hover': {
                opacity: 1,
                backgroundColor: 'background.paper',
              },
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              width: 40,
              height: 40,
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>


        {/* Edit mode indicator */}
        <Box sx={{ mb: 3, display: editable ? 'block' : 'none' }}>
          <Typography variant="h2" mb={1}>
            {t('editMode')} <CreateIcon />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('editWarning')}
          </Typography>
          <Slider
            min={9}
            max={20}
            value={fontSize}
            onChange={(_: Event, newValue: number | number[]) => setFontSize(Array.isArray(newValue) ? newValue[0] : newValue)}
            valueLabelDisplay="auto"
            aria-label="font size"
            defaultValue={12}
            sx={{ mt: 2 }}
          />
        </Box>


        {/* Main CV Paper - Always visible */}
        <Print
          printComponent={<CvPaper
            isPrintVersion
            removedSections={removedSections}
            removedSubSections={removedSubSections}
            originalCv={originalCv}
            showDiff={false} // Never show diffs in print version
          />}
          fontSize={fontSize}
          fileName={`${reduxCvProps.name}_CV${prettyfiedCompanyName ?? ''}`}
        >
          <CvPaper
            editable={editable}
            positionDetails={positionDetails}
            adjustSection={adjustSection}
            removedSections={removedSections}
            modifiedSections={modifiedSections}
            removedSubSections={removedSubSections}
            modifiedSubSections={modifiedSubSections}
            originalCv={originalCv}
            showDiff={showDiff && !!originalCv && !loading} // Show diff only when enabled AND original CV is loaded AND not loading
          />
        </Print>

        {/* Modals */}

        <ManualAdjustmentModal
          open={manualAdjustmentModalOpen}
          onClose={() => {
            setManualAdjustmentModalOpen(false);
            setIsManualAdjustmentMinimized(false);
          }}
          checkedImprovements={checked}
          onRefineCV={handleManualRefinement}
          isLoading={loading}
          _companyName={companyName}
          positionDetails={positionDetails}
          setPositionDetails={setPositionDetails}
          onAdjustForPosition={handleAdjustForPosition}
          isMinimized={isManualAdjustmentMinimized}
          onToggleMinimize={() => setIsManualAdjustmentMinimized(prev => !prev)}
          otherChanges={manualOtherChanges}
          setOtherChanges={setManualOtherChanges}
        />

        <MotivationalLetterModal
          open={motivationalLetterModalOpen}
          onClose={() => setMotivationalLetterModalOpen(false)}
          motivationalLetter={motivationalLetter}
          editableMotivationalLetter={editableMotivationalLetter}
          setEditableMotivationalLetter={setEditableMotivationalLetter}
          onDownloadPDF={downloadMotivationalLetterPDF}
          onAdjustLetter={handleAdjustLetter}
          onTranslateLetter={handleTranslateBoth}
          onGenerateLetter={getMotivationalLetter}
          selectedLanguage={selectedLanguage}
          handleLanguageChange={handleLanguageChange}
          isLoading={loading}
          companyName={companyName}
          positionDetails={positionDetails}
          setPositionDetails={setPositionDetails}
          checked={checked}
          _handleChecked={handleChecked}
        />

        <TranslationModal
          open={translationModalOpen}
          onClose={() => setTranslationModalOpen(false)}
          selectedLanguage={selectedLanguage}
          handleLanguageChange={handleLanguageChange}
          onTranslateBoth={handleTranslateBoth}
          hasMotivationalLetter={!!motivationalLetter}
          isLoading={loading}
        />

        <PositionAnalysisModal
          open={positionAnalysisModalOpen}
          onClose={() => setPositionAnalysisModalOpen(false)}
          positionIntersection={positionIntersection}
          checked={checked}
          _handleChecked={handleChecked}
          onOpenManualAdjustments={() => {
            setPositionAnalysisModalOpen(false);
            setManualAdjustmentModalOpen(true);
          }}
          _companyName={companyName}
          positionDetails={positionDetails}
          setPositionDetails={setPositionDetails}
          onAnalyzePosition={updatePositionIntersection}
          isLoading={loading}
        />

        {/* Password Modal */}
        <PasswordModal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />

        {/* Loading backdrop */}
        <Backdrop
          sx={{
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1201, // Above sidebar (1000)
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {currentOperation}
          </Typography>
        </Backdrop>

        {/* Floating Manual Adjustments Input */}
        {manualAdjustmentModalOpen && isManualAdjustmentMinimized && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: 'md',
              zIndex: 1300,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              border: '1px solid',
              borderColor: 'divider',
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EditNoteIcon color="primary" fontSize="small" />
                  Quick CV Adjustments
                </Typography>
                {checked.length > 0 && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', ml: 3 }}>
                    {checked.length} position improvement{checked.length !== 1 ? 's' : ''} selected
                    {hasImprovementDescriptions && (
                      <span style={{ color: '#1976d2', fontWeight: 500 }}>
                        , {improvementsWithDescriptions.length} with descriptions
                      </span>
                    )}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => {
                    setIsManualAdjustmentMinimized(false);
                    setManualAdjustmentModalOpen(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={async () => {
                    if (manualOtherChanges.trim() || hasImprovementDescriptions) {
                      await handleManualRefinement({
                        checkedImprovements: checked,
                        improvementInputs: {},
                        missingSkills: "",
                        otherChanges: manualOtherChanges.trim(),
                      });
                    }
                  }}
                  disabled={(!manualOtherChanges.trim() && !hasImprovementDescriptions) || loading}
                >
                  {loading ? 'Refining...' : hasImprovementDescriptions ? `Apply Changes (${improvementsWithDescriptions.length} improvements)` : 'Apply Changes'}
                </Button>
              </Box>
            </Box>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="Describe the changes you want to make to your CV..."
              variant="outlined"
              value={localManualChanges}
              onChange={(e) => {
                const value = e.target.value;
                setLocalManualChanges(value);

                if (manualChangesDebounceRef.current) {
                  clearTimeout(manualChangesDebounceRef.current);
                }

                manualChangesDebounceRef.current = setTimeout(() => {
                  setManualOtherChanges(value);
                }, 300);
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '14px',
                  lineHeight: 1.5,
                },
              }}
            />
          </Box>
        )}


        {/* Snackbar for messages */}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarMessage !== null}
          autoHideDuration={6000}
          onClose={handleClose}
          message={snackbarMessage}
          color="error"
        />
      </>
      </Box>
    </PageWrapper>
  );
}

export default CvPage;
