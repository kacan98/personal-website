"use client";
import {
  Typography,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectImprovementInput,
  selectImprovementsWithDescriptions,
  updateImprovementDescription,
  selectCurrentPosition,
  bulkUpdateImprovements,
  clearSpecificImprovement
} from "@/redux/slices/improvementDescriptions";
import { autoFillImprovementsAPIEndpointName, AutoFillImprovementsParams, AutoFillImprovementsResponse } from '@/app/api/auto-fill-improvements/model';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  AutoAwesome as AutoAwesomeIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import Button from "@/components/ui/Button";
import BaseModal from "./BaseModal";
import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/model";

// Component for improvement description input
const ImprovementDescriptionInput = ({
  improvementKey,
  placeholder,
  disabled = false
}: {
  improvementKey: string;
  placeholder: string;
  disabled?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const currentValue = useAppSelector(selectImprovementInput(improvementKey));
  const currentPosition = useAppSelector(selectCurrentPosition);
  const [localValue, setLocalValue] = useState(currentValue);

  // Check if this improvement was auto-filled
  const improvementData = currentPosition?.improvements[improvementKey];
  const isAutoFilled = improvementData?.autoFilled || false;
  const confidence = improvementData?.confidence;
  const matchedFrom = improvementData?.matchedFrom;

  // Sync local state with Redux state
  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);

  // Handler for saving on blur
  const handleSave = useCallback((value: string) => {
    dispatch(updateImprovementDescription({
      improvementKey,
      userDescription: value,
      selected: true
    }));
  }, [dispatch, improvementKey]);


  return (
    <Box>
      {isAutoFilled && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
          <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
            Auto-filled from previous experience
            {confidence && (
              <span style={{ color: '#666', fontWeight: 400 }}>
                {' '}({Math.round(confidence * 100)}% match)
              </span>
            )}
          </Typography>
        </Box>
      )}
      <TextField
        multiline
        rows={2}
        fullWidth
        size="small"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={(e) => handleSave(e.target.value)}
        disabled={disabled}
        sx={{
          '& .MuiInputBase-root': {
            fontSize: '13px',
            backgroundColor: isAutoFilled
              ? 'rgba(25, 118, 210, 0.05)'
              : 'rgba(0, 0, 0, 0.02)',
            border: isAutoFilled
              ? '1px solid rgba(25, 118, 210, 0.3)'
              : undefined,
          },
          '& .MuiInputBase-input': {
            padding: '8px 12px',
          }
        }}
      />
      {isAutoFilled && matchedFrom && (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', mt: 0.5, display: 'block' }}>
          Based on: &ldquo;{matchedFrom}&rdquo;
        </Typography>
      )}
    </Box>
  );
};

interface PositionAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  positionIntersection: JobCvIntersectionResponse | null;
  checked: string[];
  _handleChecked: (missing: string) => () => void;
  _onOpenManualAdjustments: () => void;
  onOpenQuickAdjustments: () => void;
  _companyName?: string | null;
  positionDetails: string;
  setPositionDetails: (value: string) => void;
  onAnalyzePosition: () => Promise<void>;
  isLoading: boolean;
  _onImprovementDescriptionChange?: (improvementKey: string, description: string) => void;
  setsnackbarMessage: (message: string) => void;
}

const PositionAnalysisModal = ({
  open,
  onClose,
  positionIntersection,
  checked,
  _handleChecked,
  _onOpenManualAdjustments,
  onOpenQuickAdjustments,
  _companyName,
  positionDetails,
  setPositionDetails,
  onAnalyzePosition,
  isLoading,
  _onImprovementDescriptionChange,
  setsnackbarMessage,
}: PositionAnalysisModalProps) => {
  const dispatch = useAppDispatch();
  const hasSelectedImprovements = checked.length > 0;
  const improvementsWithDescriptions = useAppSelector(selectImprovementsWithDescriptions);

  // Only count improvements that are both checked AND have descriptions
  const currentlyCheckedWithDescriptions = improvementsWithDescriptions.filter(item =>
    checked.includes(item.improvement)
  );
  const hasImprovementDescriptions = currentlyCheckedWithDescriptions.length > 0;
  const currentPosition = useAppSelector(selectCurrentPosition);
  const [localPositionDetails, setLocalPositionDetails] = useState(positionDetails);
  const positionDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Get historical positions for auto-fill
  const historicalPositions = useAppSelector((state) => state.improvementDescriptions.positions);

  // Sync local state with props
  useEffect(() => {
    setLocalPositionDetails(positionDetails);
  }, [positionDetails]);

  // Debounced handler for position details
  const handlePositionDetailsChange = useCallback((value: string) => {
    setLocalPositionDetails(value);

    if (positionDebounceRef.current) {
      clearTimeout(positionDebounceRef.current);
    }

    positionDebounceRef.current = setTimeout(() => {
      setPositionDetails(value);
    }, 300);
  }, [setPositionDetails]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (positionDebounceRef.current) {
        clearTimeout(positionDebounceRef.current);
      }
    };
  }, []);

  // Manual auto-fill function
  const handleAutoFill = useCallback(async () => {
    if (!positionIntersection?.whatIsMissing || positionIntersection.whatIsMissing.length === 0) {
      return;
    }

    setIsAutoFilling(true);

    try {
      const newImprovements = positionIntersection.whatIsMissing.map(item => item.description);
      console.log('Manual auto-fill with improvements:', newImprovements);
      console.log('Historical positions available:', Object.keys(historicalPositions).length);

      const autoFillRes = await fetch(autoFillImprovementsAPIEndpointName, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newImprovements,
          historicalPositions
        } as AutoFillImprovementsParams),
      });

      if (autoFillRes.ok) {
        const autoFillData: AutoFillImprovementsResponse = await autoFillRes.json();
        console.log('Manual auto-fill API response:', autoFillData);

        if (Object.keys(autoFillData.autoFilledImprovements).length > 0) {
          console.log('Dispatching auto-filled improvements to Redux:', autoFillData.autoFilledImprovements);

          dispatch(bulkUpdateImprovements({
            autoFilledImprovements: autoFillData.autoFilledImprovements
          }));

          const filledCount = Object.keys(autoFillData.autoFilledImprovements).length;
          setsnackbarMessage(`Auto-filled ${filledCount} improvement${filledCount !== 1 ? 's' : ''} based on your past experience!`);
          console.log(`Auto-filled ${filledCount} improvements based on historical data`);
        } else {
          setsnackbarMessage('No matching improvements found in your past experience.');
          console.log('No auto-fill matches found');
        }
      } else {
        console.warn('Auto-fill API call failed, status:', autoFillRes.status);
        const errorText = await autoFillRes.text();
        console.warn('Auto-fill error response:', errorText);
        setsnackbarMessage('Failed to auto-fill improvements. Please try again.');
      }
    } catch (autoFillError) {
      console.error('Error during auto-fill process:', autoFillError);
      setsnackbarMessage('Error occurred during auto-fill. Please try again.');
    } finally {
      setIsAutoFilling(false);
    }
  }, [positionIntersection, historicalPositions, dispatch, setsnackbarMessage]);

  // Check if there are unfilled improvements that could potentially be auto-filled
  const hasUnfilledImprovements = useCallback(() => {
    if (!positionIntersection?.whatIsMissing || Object.keys(historicalPositions).length === 0) {
      return false;
    }

    // Check if there are improvements without auto-filled data or user descriptions
    return positionIntersection.whatIsMissing.some(missing => {
      const improvementData = currentPosition?.improvements[missing.description];
      return !improvementData || (!improvementData.autoFilled && improvementData.userDescription.trim().length === 0);
    });
  }, [positionIntersection, historicalPositions, currentPosition]);

  // Actions for when analysis exists
  const analysisActions = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      {hasSelectedImprovements && (
        <Button
          variant="primary"
          onClick={() => {
            onClose();
            onOpenQuickAdjustments();
          }}
          startIcon={<TrendingUpIcon />}
        >
          Refine CV ({hasImprovementDescriptions ? currentlyCheckedWithDescriptions.length : checked.length} {hasImprovementDescriptions ? 'with details' : 'selected'})
        </Button>
      )}
    </>
  );

  // Actions for when no analysis exists
  const noAnalysisActions = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={onAnalyzePosition}
        disabled={!positionDetails || positionDetails.trim().length < 10 || isLoading}
        sx={{ minWidth: 150 }}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Position'}
      </Button>
    </>
  );

  if (!positionIntersection) {
    return (
      <BaseModal
        open={open}
        onClose={onClose}
        title="Position Analysis"
        subtitle="Analyze how your CV matches against job requirements"
        maxWidth="md"
        actions={noAnalysisActions}
        disableBackdropClick={isLoading}
      >
        <Box sx={{ mb: 3 }}>
          <TextField
            multiline
            rows={8}
            fullWidth
            label="Position Details"
            placeholder="Paste the job description here to analyze how your CV matches the requirements... (Ctrl+Enter to analyze)"
            variant="outlined"
            value={localPositionDetails}
            onChange={(e) => handlePositionDetailsChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                if (positionDetails && positionDetails.trim().length >= 10 && !isLoading) {
                  onAnalyzePosition();
                }
              }
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '14px',
                lineHeight: 1.5,
              },
            }}
          />
          {localPositionDetails && localPositionDetails.length > 0 && (
            <Typography
              variant="caption"
              color={localPositionDetails.length > 10 ? 'success.main' : 'text.secondary'}
              sx={{ mt: 1, display: 'block' }}
            >
              {localPositionDetails.length} characters
              {localPositionDetails.length <= 10 && ' (minimum 10 characters required)'}
            </Typography>
          )}
        </Box>
      </BaseModal>
    );
  }

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Position Analysis"
      subtitle={_companyName ? `Match analysis for ${_companyName}` : "CV-Position compatibility analysis"}
      maxWidth="lg"
      actions={analysisActions}
    >
      {/* Rating Overview */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AnalyticsIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {positionIntersection.rating}/10
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          Overall Match Score
        </Typography>
      </Box>

      {/* Score Interpretation */}
      <Box sx={{ mb: 4, p: 3, backgroundColor: getScoreColor(positionIntersection.rating), borderRadius: 2 }}>
        <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 500 }}>
          {getScoreInterpretation(positionIntersection.rating)}
        </Typography>
      </Box>

      {/* What's Good Section */}
      {positionIntersection.whatIsGood && positionIntersection.whatIsGood.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'success.main', fontWeight: 600 }}>
            ✅ Strengths Found
          </Typography>
          <Box sx={{ pl: 2 }}>
            {positionIntersection.whatIsGood.map((strength, index) => (
              <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="body2" sx={{ color: 'success.main', mr: 1 }}>•</Typography>
                <Typography variant="body2">{strength}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Potential Improvements Section */}
      {positionIntersection.whatIsMissing && positionIntersection.whatIsMissing.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'warning.main', fontWeight: 600 }}>
              ⚡ Potential Improvements
            </Typography>
            {hasUnfilledImprovements() && (
              <Button
                variant="primary"
                size="medium"
                onClick={handleAutoFill}
                disabled={isAutoFilling}
                startIcon={<AutoAwesomeIcon />}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                  }
                }}
              >
                {isAutoFilling ? 'Filling...' : 'Fill from past jobs'}
              </Button>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select the skills or experiences you actually have to include them in your CV refinement:
          </Typography>
          <Box sx={{ pl: 1 }}>
            {positionIntersection.whatIsMissing.map((missing, index) => {
              const improvementData = currentPosition?.improvements[missing.description];
              const isAutoFilled = improvementData?.autoFilled || false;

              return (
                <Box key={index} sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked.includes(missing.description)}
                        onChange={_handleChecked(missing.description)}
                        disabled={isAutoFilling}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {missing.description}
                          </Typography>
                          {isAutoFilled && (
                            <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {missing.whatWouldImproveTheCv}
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start', width: '100%' }}
                  />
                  {checked.includes(missing.description) && (
                    <Box sx={{ mt: 1, ml: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <ImprovementDescriptionInput
                            improvementKey={missing.description}
                            placeholder="Describe your experience with this skill or requirement..."
                            disabled={isAutoFilling}
                          />
                        </Box>
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => {
                            dispatch(clearSpecificImprovement(missing.description));
                          }}
                          sx={{
                            minWidth: '40px',
                            width: '40px',
                            height: '40px',
                            p: 0,
                            color: 'error.main',
                            borderColor: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.main',
                              color: 'white',
                            }
                          }}
                          disabled={isAutoFilling}
                        >
                          <ClearIcon fontSize="small" />
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>
        </Box>
      )}

      {/* Analysis Opinion */}
      {positionIntersection.opinion && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            💡 Analysis Summary
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            {positionIntersection.opinion}
          </Typography>
        </Box>
      )}

    </BaseModal>
  );
};

// Helper functions
const getScoreColor = (rating: number): string => {
  if (rating >= 8) return 'rgba(16, 185, 129, 0.1)'; // Green
  if (rating >= 6) return 'rgba(245, 158, 11, 0.1)'; // Yellow
  if (rating >= 4) return 'rgba(249, 115, 22, 0.1)'; // Orange
  return 'rgba(239, 68, 68, 0.1)'; // Red
};

const getScoreInterpretation = (rating: number): string => {
  if (rating >= 8) return '🎯 Excellent match! Your CV aligns very well with this position.';
  if (rating >= 6) return '👍 Good match! Some improvements could strengthen your application.';
  if (rating >= 4) return '⚡ Moderate match. Consider highlighting relevant experience more prominently.';
  return '🔧 Lower match. Focus on emphasizing transferable skills and relevant experience.';
};

export default PositionAnalysisModal;