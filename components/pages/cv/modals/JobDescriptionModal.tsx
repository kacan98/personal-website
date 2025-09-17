"use client";
import {
  TextField,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import BaseModal from "./BaseModal";
import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/model";
import IntersectionSection from "../paper/intersectionSection";

interface JobDescriptionModalProps {
  open: boolean;
  onClose: () => void;
  positionDetails: string;
  setPositionDetails: (value: string) => void;
  onAdjustCV: () => Promise<void>;
  positionIntersection: JobCvIntersectionResponse | null;
  checked: string[];
  handleChecked: (missing: string) => () => void;
  companyName?: string | null;
  isLoading: boolean;
}

const JobDescriptionModal = ({
  open,
  onClose,
  positionDetails,
  setPositionDetails,
  onAdjustCV,
  positionIntersection,
  checked,
  handleChecked,
  companyName,
  isLoading,
}: JobDescriptionModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasAdjusted, setHasAdjusted] = useState(false);
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

  const steps = [
    'Enter Job Description',
    'CV Adjustment',
    'Review Analysis'
  ];

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setHasAdjusted(false);
    }
  }, [open]);

  // Update step based on state
  useEffect(() => {
    if (positionDetails && positionDetails.length > 10) {
      if (positionIntersection && hasAdjusted) {
        setCurrentStep(2); // Show analysis
      } else if (hasAdjusted) {
        setCurrentStep(1); // Adjustment in progress
      }
    } else {
      setCurrentStep(0);
    }
  }, [positionDetails, positionIntersection, hasAdjusted]);

  const handleAdjust = async () => {
    if (positionDetails && positionDetails.trim().length > 10) {
      setHasAdjusted(true);
      setCurrentStep(1);
      await onAdjustCV();
    }
  };

  const canAdjust = positionDetails && positionDetails.trim().length > 10;
  const showAnalysis = positionIntersection && hasAdjusted;

  const actions = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={isLoading}>
        {showAnalysis ? 'Close' : 'Cancel'}
      </Button>
      {!showAnalysis && (
        <Button
          variant="primary"
          onClick={handleAdjust}
          disabled={!canAdjust || isLoading}
        >
          {isLoading ? 'Adjusting CV...' : 'Adjust CV for Position'}
        </Button>
      )}
    </>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Adjust CV for Position"
      subtitle={companyName ? `Company: ${companyName}` : "Personalize your CV based on job requirements"}
      maxWidth="lg"
      actions={actions}
      disableBackdropClick={isLoading}
    >
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step 1: Job Description Input */}
      {currentStep === 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Enter Job Description
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Paste the job posting or description here. The AI will analyze it and personalize your CV to better match the requirements.
          </Typography>
          <TextField
            multiline
            rows={12}
            fullWidth
            label="Job Description"
            placeholder="Paste the job posting here..."
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
      )}

      {/* Step 2: Processing */}
      {currentStep === 1 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Personalizing Your CV
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI is analyzing the job requirements and customizing your CV...
            <br />
            This includes generating a matching motivational letter.
          </Typography>
        </Box>
      )}

      {/* Step 3: Results */}
      {currentStep === 2 && showAnalysis && (
        <Box>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>CV successfully personalized!</strong> Your CV has been adjusted to better match the position requirements, and a motivational letter has been generated.
            </Typography>
          </Alert>

          <Typography variant="h6" sx={{ mb: 3 }}>
            Position Analysis Results
          </Typography>

          <IntersectionSection
            positionIntersection={positionIntersection}
            checked={checked}
            handleChecked={handleChecked}
          />

          <Box sx={{ mt: 3, p: 3, backgroundColor: 'rgba(25, 118, 210, 0.08)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Next Steps:</strong>
            </Typography>
            <Typography variant="body2" component="div">
              • Check any relevant improvements above that apply to your experience
              <br />
              • Use <strong>Manual Adjustments</strong> for additional refinements
              <br />
              • View your <strong>Motivational Letter</strong> when ready
              <br />
              • <strong>Download or print</strong> your personalized CV
            </Typography>
          </Box>
        </Box>
      )}
    </BaseModal>
  );
};

export default JobDescriptionModal;