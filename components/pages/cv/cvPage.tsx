"use client";
import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/model";
import { MotivationalLetterResponse } from "@/app/api/motivational-letter/motivational-letter.model";
import PageWrapper from "@/components/pages/pageWrapper";
import Print from "@/components/print";
import { useAppSelector } from "@/redux/hooks";
import CreateIcon from '@mui/icons-material/Create';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Paper,
  Slider,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  Typography
} from "@mui/material";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { AiForm } from "./aiForm";
import { useCvTools } from "./hooks/useCvTools";
import CvLanguageSelectionComponent from "./languageSelect";
import CvPaper from "./paper/cvPaper";

const DEV = process.env.NODE_ENV === "development";

export type CvProps = {
  jobDescription?: string
};

function CvPage({ jobDescription }: CvProps) {
  const reduxCvProps = useAppSelector((state) => state.cv);
  const [selectedLanguage, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setsnackbarMessage] = useState<string | null>(null);
  const [titleClickedTimes, setTitleClickedTimes] = useState(0);
  const editable = titleClickedTimes >= 5 || DEV;
  const [positionSummary, setPositionSummary] = useState<string>('')
  const [positionDetails, setPositionDetails] = useState<string>('')
  const [shouldAdjustCv, setShouldAdjustCv] = useState(false);
  const [positionIntersection, setPositionIntersection] = useState<JobCvIntersectionResponse | null>(null)
  const [checked, setChecked] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [motivationalLetter, setMotivationalLetter] = useState<MotivationalLetterResponse | null>(null);
  const [editableMotivationalLetter, setEditableMotivationalLetter] = useState<MotivationalLetterResponse | null>(null);
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [editableLetterText, setEditableLetterText] = useState<string>('');
  const [letterComments, setLetterComments] = useState<string>('');
  const [isAdjustingLetter, setIsAdjustingLetter] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string>('Discussing with AI...');
  const [removedSections, setRemovedSections] = useState<Set<string>>(new Set());
  const [modifiedSections, setModifiedSections] = useState<Set<string>>(new Set());
  const [removedSubSections, setRemovedSubSections] = useState<Set<string>>(new Set());
  const [modifiedSubSections, setModifiedSubSections] = useState<Set<string>>(new Set());
  const [cvAdjusted, setCvAdjusted] = useState(false);
  const { getMotivationalLetter,
    adjustMotivationalLetter,
    updatePositionIntersection,
    getSummary,
    adjustCvBasedOnPosition,
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
      setLanguage
    })
  const prettyfiedCompanyName = companyName ? `_${companyName.split(" ").join("_")}` : ''
  const [fontSize, setFontSize] = useState(12);

  // Callback functions for tracking section changes
  const handleSectionAdjusted = (sectionKey: string) => {
    setModifiedSections(prev => new Set([...prev, sectionKey]));
  };

  const handleRemoveSection = (sectionKey: string) => {
    setRemovedSections(prev => new Set([...prev, sectionKey]));
  };

  const handleRestoreSection = (sectionKey: string) => {
    setRemovedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionKey);
      return newSet;
    });
  };

  const handleRemoveSubSection = (subSectionKey: string) => {
    setRemovedSubSections(prev => new Set([...prev, subSectionKey]));
  };

  const handleRestoreSubSection = (subSectionKey: string) => {
    setRemovedSubSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(subSectionKey);
      return newSet;
    });
  };

  const handleSubSectionAdjusted = (subSectionKey: string) => {
    setModifiedSubSections(prev => new Set([...prev, subSectionKey]));
  };

  // Helper functions for converting between structured and text formats
  const convertLetterToText = (letter: MotivationalLetterResponse): string => {
    let text = '';

    if (letter.greeting) text += letter.greeting + '\n\n';
    if (letter.opening) text += letter.opening + '\n\n';
    if (letter.whyThisRole) text += letter.whyThisRole + '\n\n';

    if (letter.keyStrengths && letter.keyStrengths.length > 0) {
      text += 'Why I am a good fit:\n' + letter.keyStrengths.map(strength => `• ${strength}`).join('\n') + '\n\n';
    }

    if (letter.uniqueValue) text += letter.uniqueValue + '\n\n';
    if (letter.closing) text += letter.closing + '\n\n';
    if (letter.signature) text += letter.signature;

    return text.trim();
  };

  const convertTextToLetter = (text: string): MotivationalLetterResponse => {
    // Split text into sections based on double line breaks
    const sections = text.split('\n\n').map(section => section.trim()).filter(section => section);

    let greeting = '';
    let opening = '';
    let whyThisRole = '';
    const keyStrengths: string[] = [];
    let uniqueValue = '';
    let closing = '';
    let signature = '';

    let keyStrengthsIndex = -1;

    // Find the key strengths section first
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.toLowerCase().includes('key strengths:') || section.toLowerCase().includes('why i\'m a good fit:')) {
        keyStrengthsIndex = i;
        // Extract key strengths from this section
        const lines = section.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('•')) {
            keyStrengths.push(line.replace(/^•\s*/, '').trim());
          }
        }
        break;
      }
    }

    // Assign other sections based on position relative to key strengths
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      // Skip the key strengths section as we already processed it
      if (i === keyStrengthsIndex) continue;

      // Detect signature (usually short, at the end)
      if (i === sections.length - 1 && section.length < 50 && !section.toLowerCase().includes('sincerely') && !section.toLowerCase().includes('regards')) {
        signature = section;
        continue;
      }

      // Detect closing (usually contains certain keywords)
      if (section.toLowerCase().includes('sincerely') ||
        section.toLowerCase().includes('best regards') ||
        section.toLowerCase().includes('look forward') ||
        section.toLowerCase().includes('thank you') ||
        section.toLowerCase().includes('yours faithfully')) {
        closing = section;
        continue;
      }

      // Assign sections based on position
      if (keyStrengthsIndex === -1) {
        // No key strengths found, distribute among all sections
        if (i === 0) greeting = section;
        else if (i === 1) opening = section;
        else if (i === 2) whyThisRole = section;
        else if (i === 3) uniqueValue = section;
        else if (i === 4) closing = section;
        else if (i === 5) signature = section;
      } else {
        // Key strengths found, assign relative to it
        if (i < keyStrengthsIndex) {
          if (i === 0) greeting = section;
          else if (i === 1) opening = section;
          else if (i === 2) whyThisRole = section;
        } else {
          // After key strengths
          if (!uniqueValue) uniqueValue = section;
          else if (!closing) closing = section;
          else if (!signature) signature = section;
        }
      }
    }

    return { greeting, opening, whyThisRole, keyStrengths, uniqueValue, closing, signature };
  };

  const handleStartEditing = () => {
    const letterToEdit = editableMotivationalLetter || motivationalLetter;
    if (letterToEdit) {
      setEditableLetterText(convertLetterToText(letterToEdit));
      setIsEditingLetter(true);
    }
  };

  const handleFinishEditing = () => {
    if (editableLetterText) {
      const parsedLetter = convertTextToLetter(editableLetterText);
      setEditableMotivationalLetter(parsedLetter);
    }
    setIsEditingLetter(false);
  };

  const handleCancelEditing = () => {
    setIsEditingLetter(false);
    // Reset to original text
    const letterToEdit = editableMotivationalLetter || motivationalLetter;
    if (letterToEdit) {
      setEditableLetterText(convertLetterToText(letterToEdit));
    }
  };

  useEffect(() => {
    if (motivationalLetter) {
      setEditableMotivationalLetter(motivationalLetter);
      setEditableLetterText(convertLetterToText(motivationalLetter));
    }
  }, [motivationalLetter]);

  useEffect(() => {
    if (jobDescription && jobDescription.trim().length > 0) {
      setPositionDetails(jobDescription);
      setShouldAdjustCv(true);
    }
  }, [jobDescription]);

  useEffect(() => {
    if (shouldAdjustCv && positionDetails && positionDetails.trim().length > 0) {
      // Run CV adjustment and motivational letter generation in parallel
      const runParallelTasks = async () => {
        setLoading(true);
        setCurrentOperation('Personalizing CV and generating motivational letter...');
        try {
          await Promise.all([
            adjustCvBasedOnPosition(),
            getMotivationalLetter(positionDetails, checked, selectedLanguage)
          ]);
          setsnackbarMessage('CV personalized and motivational letter generated successfully!');
        } catch (error) {
          setsnackbarMessage('Error during CV personalization or letter generation');
        } finally {
          setLoading(false);
          setCurrentOperation('Discussing with AI...');
        }
      };

      runParallelTasks();
      setShouldAdjustCv(false);
    }
  }, [positionDetails, shouldAdjustCv, adjustCvBasedOnPosition, getMotivationalLetter, checked, selectedLanguage, setsnackbarMessage]);

  useEffect(() => {
    if (snackbarMessage === 'CV transformed') {
      setCvAdjusted(true);
    }
  }, [snackbarMessage]);

  const handleLanguageChange = async (l: any) => {
    setLanguage(l.target.value);
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
    setTitleClickedTimes(prev => prev + 1);
  }

  const handleChecked = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  }

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
      // For now, use simple replacements - this ensures the PDF generates correctly
      // TODO: In future, consider using a custom font that supports Czech characters
      return text
        .replace(/č/g, 'c')
        .replace(/Č/g, 'C')
        .replace(/ř/g, 'r')
        .replace(/Ř/g, 'R')
        .replace(/š/g, 's')
        .replace(/Š/g, 'S')
        .replace(/ž/g, 'z')
        .replace(/Ž/g, 'Z')
        .replace(/ý/g, 'y')
        .replace(/Ý/g, 'Y')
        .replace(/á/g, 'a')
        .replace(/Á/g, 'A')
        .replace(/é/g, 'e')
        .replace(/É/g, 'E')
        .replace(/í/g, 'i')
        .replace(/Í/g, 'I')
        .replace(/ó/g, 'o')
        .replace(/Ó/g, 'O')
        .replace(/ú/g, 'u')
        .replace(/Ú/g, 'U')
        .replace(/ů/g, 'u')
        .replace(/Ů/g, 'U')
        .replace(/ď/g, 'd')
        .replace(/Ď/g, 'D')
        .replace(/ť/g, 't')
        .replace(/Ť/g, 'T')
        .replace(/ň/g, 'n')
        .replace(/Ň/g, 'N');
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

    // Add all the letter sections
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

    // Add key strengths if they exist
    if (letterToUse.keyStrengths && letterToUse.keyStrengths.length > 0) {
      // Add some space and the Why I'm a good fit header
      currentY += 3;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      addTextWithLineBreaks('Why I\'m a good fit:', margin, currentY);
      currentY += 8;

      // Add each strength as a bullet point
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      letterToUse.keyStrengths.forEach((strength) => {
        const bulletText = `• ${strength}`;
        const strengthHeight = addTextWithLineBreaks(bulletText, margin, currentY, textWidth);
        currentY += strengthHeight + 2;
      });

      currentY += 6; // Space before next section
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
      const signatureHeight = addTextWithLineBreaks(letterToUse.signature, margin, currentY, textWidth);
      currentY += signatureHeight;
    }

    // Save the PDF preserving special characters
    const fileName = `Motivational_Letter${prettyfiedCompanyName || ''}.pdf`;
    pdf.save(fileName);
  };

  const handleManualMotivationalLetter = async () => {
    setLoading(true);
    setCurrentOperation('Generating motivational letter...');
    try {
      await getMotivationalLetter(positionDetails, checked, selectedLanguage);
      setsnackbarMessage('Motivational letter generated successfully!');
    } catch (error) {
      setsnackbarMessage('Error generating motivational letter');
    } finally {
      setLoading(false);
      setCurrentOperation('Discussing with AI...');
    }
  };

  const handleAdjustLetterWithComments = async () => {
    if (!letterComments.trim() || !motivationalLetter) {
      setsnackbarMessage('Please add comments for adjustment');
      return;
    }

    setIsAdjustingLetter(true);
    setLoading(true);
    setCurrentOperation('Adjusting motivational letter based on your feedback...');

    try {
      const currentLetter = editableMotivationalLetter || motivationalLetter;
      await adjustMotivationalLetter(
        currentLetter,
        letterComments,
        positionDetails,
        reduxCvProps,
        selectedLanguage
      );
      setLetterComments(''); // Clear comments after successful adjustment
      setsnackbarMessage('Motivational letter adjusted successfully!');
    } catch (error) {
      setsnackbarMessage('Error adjusting motivational letter');
    } finally {
      setLoading(false);
      setIsAdjustingLetter(false);
      setCurrentOperation('Discussing with AI...');
    }
  };

  const handleTranslateBoth = async () => {
    if (selectedLanguage === 'English') {
      setsnackbarMessage('Please select a language to translate to');
      return;
    }

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
  };

  return (
    <PageWrapper title={"Resume"} onTitleClicked={onTitleClicked}>
      {editable && (
        <>
          <Typography variant="h2" mb={2}>
            Now you can edit. <CreateIcon />
          </Typography>
          <Typography variant="body1">
            But be careful. This is possible just to tweak something (or transform with AI) locally on your machine before sending it to potential employers.
            The changes won&apos;t be saved in any way.
          </Typography>
        </>
      )}

      <Box sx={{ mb: 5, mt: 2 }}>
        {/* AI did not work in the past in production because of limitations in Vercel :((( */}
        {/* but let's try */}
        {DEV && (
          <>
            {
              <AiForm
                positionIntersection={positionIntersection}
                checked={checked}
                positionSummary={positionSummary}
                positionDetails={positionDetails}

                setLoading={setLoading}
                setsnackbarMessage={setsnackbarMessage}
                setCompanyName={setCompanyName}
                setPositionSummary={setPositionSummary}
                setPositionDetails={setPositionDetails}
                handleChecked={handleChecked}

                getSummary={getSummary}
                updatePositionIntersection={updatePositionIntersection}
                adjustCvBasedOnPosition={adjustCvBasedOnPosition}
              />
            }
          </>
        )}
      </Box>

      {/* show a slider for font size */}
      {editable && <Slider
        min={9}
        max={20}
        value={fontSize}
        onChange={(_: any, newValue: number) => setFontSize(newValue)}
        valueLabelDisplay="auto"
        aria-label="font size"
        defaultValue={12}
        sx={{ mb: 2 }} />
      }

      {/* Fixed bottom-left combined status indicator */}
      {(jobDescription && cvAdjusted) && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1000,
            p: 2.5,
            borderRadius: 2,
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            color: 'text.primary',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1,
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
            maxWidth: '220px'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: '#3b82f6', fontSize: '18px' }}>✔️</Box>
            {motivationalLetter && (
              <Box sx={{ color: '#10b981', fontSize: '18px' }}>📝</Box>
            )}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500, margin: 0, color: 'text.primary' }}>
            CV tailored for this position
          </Typography>
          {motivationalLetter && (
            <Typography variant="caption" sx={{ margin: 0, color: 'text.secondary', fontSize: '11px' }}>
              + Motivational letter ready for download
            </Typography>
          )}
        </Box>
      )}

      {/* Fixed top-right CV adjustments indicator */}
      {(modifiedSections.size > 0 || modifiedSubSections.size > 0 || removedSections.size > 0 || removedSubSections.size > 0) && (
        <Box
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 999,
            p: 2.5,
            borderRadius: 2,
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            color: 'text.primary',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1,
            border: '1px solid rgba(16, 185, 129, 0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(8px)',
            maxWidth: '200px'
          }}
        >
          <Box sx={{ color: '#10b981', fontSize: '18px' }}>✓</Box>
          <Typography variant="body2" sx={{ fontWeight: 500, margin: 0, color: 'text.primary' }}>
            CV Successfully Adjusted
          </Typography>
          <Typography variant="caption" sx={{ margin: 0, color: 'text.secondary', fontSize: '11px' }}>
            {modifiedSections.size + modifiedSubSections.size > 0 &&
              `${modifiedSections.size + modifiedSubSections.size} section${modifiedSections.size + modifiedSubSections.size !== 1 ? 's' : ''} modified`
            }
            {(modifiedSections.size + modifiedSubSections.size > 0) && (removedSections.size + removedSubSections.size > 0) && ', '}
            {removedSections.size + removedSubSections.size > 0 &&
              `${removedSections.size + removedSubSections.size} removed`
            }
          </Typography>
        </Box>
      )}

      <Print printComponent={<CvPaper isPrintVersion />} fontSize={fontSize} fileName={`${reduxCvProps.name}_CV${prettyfiedCompanyName ?? ''}`}>
        <CvPaper
          editable={editable}
          positionDetails={positionDetails}
          adjustSection={adjustSection}
          removedSections={removedSections}
          modifiedSections={modifiedSections}
          onRemoveSection={handleRemoveSection}
          onRestoreSection={handleRestoreSection}
          onSectionAdjusted={handleSectionAdjusted}
          removedSubSections={removedSubSections}
          modifiedSubSections={modifiedSubSections}
          onRemoveSubSection={handleRemoveSubSection}
          onRestoreSubSection={handleRestoreSubSection}
          onSubSectionAdjusted={handleSubSectionAdjusted}
        />
      </Print>

      {DEV && !motivationalLetter && (
        <>
          <Box mb={2}>
            <CvLanguageSelectionComponent
              selectedLanguage={selectedLanguage}
              handleLanguageChange={handleLanguageChange}
            />
          </Box>
          <Button
            type="button"
            onClick={handleTranslateBoth}
            sx={{ mt: 2, width: "100%" }}
            variant="outlined"
            disabled={loading}
          >
            Translate CV
          </Button>
        </>
      )}

      {DEV && (
        <>
          <Button
            type="button"
            onClick={handleManualMotivationalLetter}
            sx={{ mt: 2, mb: 2, width: "100%" }}
            variant="outlined"
            disabled={!positionDetails || positionDetails.trim().length === 0}
          >
            {motivationalLetter ? 'Regenerate Motivational Letter' : 'Get Motivational Letter'}
          </Button>
          {motivationalLetter && (
            <Paper elevation={2} sx={{ mt: 5, p: 4, backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Motivational Letter
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {isEditingLetter ? (
                    <>
                      <Button
                        variant="outlined"
                        onClick={handleCancelEditing}
                        sx={{ borderRadius: 2 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleFinishEditing}
                        sx={{ borderRadius: 2 }}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={handleStartEditing}
                        sx={{ borderRadius: 2, mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        onClick={downloadMotivationalLetterPDF}
                        sx={{ borderRadius: 2 }}
                      >
                        Download PDF
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              {isEditingLetter ? (
                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  value={editableLetterText}
                  onChange={(e) => setEditableLetterText(e.target.value)}
                  placeholder="Edit your motivational letter here..."
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '16px',
                      lineHeight: 1.6,
                      fontFamily: 'inherit'
                    }
                  }}
                />
              ) : (
                <Box
                  sx={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderRadius: 1
                    },
                    p: 1,
                    minHeight: 200
                  }}
                  onClick={handleStartEditing}
                >
                  <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', mb: 1, fontStyle: 'italic' }}>
                    Click to edit
                  </Typography>

                    {/* Display the current letter content */}
                    <Box sx={{ fontSize: '16px', lineHeight: 1.6 }}>
                      {(() => {
                        const letterToShow = editableMotivationalLetter || motivationalLetter;
                        if (letterToShow) {
                          return (
                            <>
                              {/* Greeting */}
                              {letterToShow.greeting && (
                                <Box sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                                  {letterToShow.greeting}
                                </Box>
                              )}

                              {/* Opening */}
                              {letterToShow.opening && (
                                <Box sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                                  {letterToShow.opening}
                                </Box>
                              )}

                              {/* Why This Role */}
                              {letterToShow.whyThisRole && (
                                <Box sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                                  {letterToShow.whyThisRole}
                                </Box>
                              )}

                              {/* Key Strengths */}
                              {letterToShow.keyStrengths && letterToShow.keyStrengths.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                  <Typography variant="h6" sx={{ mb: 1.5, fontSize: '18px', fontWeight: 600 }}>
                                    Why I&apos;m a good fit:
                                  </Typography>
                                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                    {letterToShow.keyStrengths.map((strength, index) => (
                                      <Box component="li" key={index} sx={{ mb: 0.5 }}>
                                        {strength}
                                      </Box>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {/* Unique Value */}
                            {letterToShow.uniqueValue && (
                              <Box sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                                {letterToShow.uniqueValue}
                              </Box>
                            )}

                            {/* Closing */}
                            {letterToShow.closing && (
                              <Box sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                                {letterToShow.closing}
                              </Box>
                            )}

                            {/* Signature */}
                            {letterToShow.signature && (
                              <Box sx={{ whiteSpace: 'pre-line' }}>
                                {letterToShow.signature}
                              </Box>
                            )}
                          </>
                        );
                      }
                      return null;
                    })()}
                  </Box>
                </Box>
              )}

              {/* Comments section for AI adjustment */}
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                  Request AI Adjustments
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Provide specific feedback about how you&apos;d like the letter to be improved. The AI will analyze your CV to highlight relevant skills and experience that match the job requirements.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={letterComments}
                  onChange={(e) => setLetterComments(e.target.value)}
                  placeholder="E.g., 'Highlight my React experience more', 'Emphasize my leadership skills', 'Connect my backend experience to their tech stack', 'Make it more specific to this role', etc."
                  sx={{ mb: 2 }}
                  variant="outlined"
                />
                <Button
                  variant="outlined"
                  onClick={handleAdjustLetterWithComments}
                  disabled={!letterComments.trim() || isAdjustingLetter || loading}
                  sx={{ borderRadius: 2 }}
                >
                  {isAdjustingLetter ? 'Adjusting Letter...' : 'Submit Feedback & Adjust'}
                </Button>
              </Box>

              {/* Translation section */}
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                  Translation
                </Typography>
                <Box mb={2}>
                  <CvLanguageSelectionComponent
                    selectedLanguage={selectedLanguage}
                    handleLanguageChange={handleLanguageChange}
                  />
                </Box>
                <Button
                  type="button"
                  onClick={handleTranslateBoth}
                  sx={{ width: "100%", borderRadius: 2 }}
                  variant="outlined"
                  disabled={loading}
                >
                  Translate CV & Motivational Letter
                </Button>
              </Box>
            </Paper>
          )}
        </>
      )}

      <Backdrop
        sx={{
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {currentOperation}
        </Typography>
      </Backdrop>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarMessage !== null}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
        color="error"
      />
    </PageWrapper >
  );
}

export default CvPage;
