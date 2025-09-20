"use client";
import {
  Typography,
  Box,
  Alert,
  Chip,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectImprovementInput,
  selectImprovementsWithDescriptions,
  updateImprovementDescription
} from "@/redux/slices/improvementDescriptions";
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";
import Button from "@/components/ui/Button";
import BaseModal from "./BaseModal";
import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/model";

// Component for improvement description input
const ImprovementDescriptionInput = ({
  improvementKey,
  placeholder
}: {
  improvementKey: string;
  placeholder: string;
}) => {
  const dispatch = useAppDispatch();
  const currentValue = useAppSelector(selectImprovementInput(improvementKey));
  const [localValue, setLocalValue] = useState(currentValue);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sync local state with Redux state
  useEffect(() => {
    setLocalValue(currentValue);
  }, [currentValue]);

  // Debounced handler for input changes
  const handleInputChange = useCallback((value: string) => {
    setLocalValue(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      dispatch(updateImprovementDescription({
        improvementKey,
        userDescription: value,
        selected: true
      }));
    }, 300);
  }, [dispatch, improvementKey]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <TextField
      multiline
      rows={2}
      fullWidth
      size="small"
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => handleInputChange(e.target.value)}
      sx={{
        '& .MuiInputBase-root': {
          fontSize: '13px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
        '& .MuiInputBase-input': {
          padding: '8px 12px',
        }
      }}
    />
  );
};

interface PositionAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  positionIntersection: JobCvIntersectionResponse | null;
  checked: string[];
  _handleChecked: (missing: string) => () => void;
  onOpenManualAdjustments: () => void;
  _companyName?: string | null;
  positionDetails: string;
  setPositionDetails: (value: string) => void;
  onAnalyzePosition: () => Promise<void>;
  isLoading: boolean;
  onImprovementDescriptionChange?: (improvementKey: string, description: string) => void;
}

const PositionAnalysisModal = ({
  open,
  onClose,
  positionIntersection,
  checked,
  _handleChecked,
  onOpenManualAdjustments,
  _companyName,
  positionDetails,
  setPositionDetails,
  onAnalyzePosition,
  isLoading,
  onImprovementDescriptionChange,
}: PositionAnalysisModalProps) => {
  const dispatch = useAppDispatch();
  const hasSelectedImprovements = checked.length > 0;
  const improvementsWithDescriptions = useAppSelector(selectImprovementsWithDescriptions);
  const hasImprovementDescriptions = improvementsWithDescriptions.length > 0;
  const [localPositionDetails, setLocalPositionDetails] = useState(positionDetails);
  const positionDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
            onOpenManualAdjustments();
          }}
          startIcon={<TrendingUpIcon />}
        >
          Refine CV ({hasImprovementDescriptions ? improvementsWithDescriptions.length : checked.length} {hasImprovementDescriptions ? 'with details' : 'selected'})
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
            placeholder="Paste the job description here to analyze how your CV matches the requirements..."
            variant="outlined"
            value={localPositionDetails}
            onChange={(e) => handlePositionDetailsChange(e.target.value)}
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
          <Typography variant="h6" sx={{ mb: 2, color: 'warning.main', fontWeight: 600 }}>
            ⚡ Potential Improvements
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select the skills or experiences you actually have to include them in your CV refinement:
          </Typography>
          <Box sx={{ pl: 1 }}>
            {positionIntersection.whatIsMissing.map((missing, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked.includes(missing.description)}
                      onChange={_handleChecked(missing.description)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {missing.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {missing.whatWouldImproveTheCv}
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', width: '100%' }}
                />
                {checked.includes(missing.description) && (
                  <Box sx={{ mt: 1, ml: 4 }}>
                    <ImprovementDescriptionInput
                      improvementKey={missing.description}
                      placeholder="Describe your experience with this skill or requirement..."
                    />
                  </Box>
                )}
              </Box>
            ))}
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

      <Divider sx={{ my: 3 }} />

      {/* Selected Improvements Summary */}
      {hasSelectedImprovements && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              <strong>{checked.length} improvement{checked.length !== 1 ? 's' : ''} selected</strong>
              {hasImprovementDescriptions && (
                <span>, <strong>{improvementsWithDescriptions.length} with descriptions</strong></span>
              )}:
            </Typography>
            {checked.slice(0, 3).map((item, index) => (
              <Chip
                key={index}
                label={item}
                size="small"
                color={improvementsWithDescriptions.some(imp => imp.improvement === item) ? "primary" : "success"}
                variant="outlined"
              />
            ))}
            {checked.length > 3 && (
              <Chip label={`+${checked.length - 3} more`} size="small" color="success" variant="outlined" />
            )}
          </Box>
          {hasImprovementDescriptions && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              💡 Items with descriptions will be prioritized during CV refinement
            </Typography>
          )}
        </Alert>
      )}

      {/* Action Guidance */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: 'rgba(25, 118, 210, 0.08)', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recommended Next Steps
          </Typography>
        </Box>

        <Box component="ol" sx={{ pl: 3, m: 0 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body2">
              <strong>Select relevant improvements:</strong> Check any skills or experience from the &quot;Potential improvements&quot; that you actually possess.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body2">
              <strong>Use Manual Adjustments:</strong> Add specific details about your experience and request targeted CV modifications.
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body2">
              <strong>Review & Download:</strong> Check your refined CV and download the final version along with your motivational letter.
            </Typography>
          </Box>
        </Box>
      </Box>
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