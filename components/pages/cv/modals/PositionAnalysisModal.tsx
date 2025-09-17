"use client";
import {
  Typography,
  Box,
  Alert,
  Chip,
  TextField,
} from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";
import Button from "@/components/ui/Button";
import BaseModal from "./BaseModal";
import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/model";

interface PositionAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  positionIntersection: JobCvIntersectionResponse | null;
  checked: string[];
  handleChecked: (missing: string) => () => void;
  onOpenManualAdjustments: () => void;
  companyName?: string | null;
  positionDetails: string;
  setPositionDetails: (value: string) => void;
  onAnalyzePosition: () => Promise<void>;
  isLoading: boolean;
}

const PositionAnalysisModal = ({
  open,
  onClose,
  positionIntersection,
  checked,
  handleChecked,
  onOpenManualAdjustments,
  companyName,
  positionDetails,
  setPositionDetails,
  onAnalyzePosition,
  isLoading,
}: PositionAnalysisModalProps) => {
  const hasSelectedImprovements = checked.length > 0;
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
          Refine CV ({checked.length} selected)
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
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnalyticsIcon color="primary" fontSize="small" />
          Get Position Insights
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Paste a job description below to get detailed analysis of how your CV matches the requirements, identify gaps, and get improvement suggestions.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Job Description or Position Details
          </Typography>
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
      subtitle={companyName ? `Match analysis for ${companyName}` : "CV-Position compatibility analysis"}
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

      {/* Selected Improvements Summary */}
      {hasSelectedImprovements && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              <strong>{checked.length} improvement{checked.length !== 1 ? 's' : ''} selected:</strong>
            </Typography>
            {checked.slice(0, 3).map((item, index) => (
              <Chip key={index} label={item} size="small" color="success" variant="outlined" />
            ))}
            {checked.length > 3 && (
              <Chip label={`+${checked.length - 3} more`} size="small" color="success" variant="outlined" />
            )}
          </Box>
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