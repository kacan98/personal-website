"use client";
import {
  TextField,
  Typography,
  Box,
} from "@mui/material";


import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import BaseModal from "./BaseModal";

interface ManualAdjustmentModalProps {
  open: boolean;
  onClose: () => void;
  checkedImprovements: string[];
  onRefineCV: (refinementData: {
    checkedImprovements: string[];
    improvementInputs: { [key: string]: string };
    missingSkills: string;
    otherChanges: string;
  }) => Promise<void>;
  isLoading: boolean;
  _companyName?: string | null;
  positionDetails: string;
  setPositionDetails: (value: string) => void;
  onAdjustForPosition: () => Promise<void>;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  otherChanges?: string;
  setOtherChanges?: (value: string) => void;
}

const ManualAdjustmentModal = ({
  open,
  onClose,
  checkedImprovements,
  onRefineCV,
  isLoading,
  _companyName,
  positionDetails,
  setPositionDetails,
  onAdjustForPosition,
  isMinimized: externalIsMinimized,
  onToggleMinimize: externalOnToggleMinimize,
  otherChanges: externalOtherChanges,
  setOtherChanges: externalSetOtherChanges,
}: ManualAdjustmentModalProps) => {
  const [internalOtherChanges, setInternalOtherChanges] = useState("");
  const [_hasSubmitted, setHasSubmitted] = useState(false);
  const [internalIsMinimized, setInternalIsMinimized] = useState(false);
  const [localOtherChanges, setLocalOtherChanges] = useState("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [localImprovementInputs, setLocalImprovementInputs] = useState<{ [key: string]: string }>({});
  const improvementDebounceRefs = useRef<{ [key: string]: NodeJS.Timeout | undefined }>({});

  // Use external state if provided, otherwise use internal state
  const otherChanges = externalOtherChanges ?? internalOtherChanges;
  const setOtherChanges = externalSetOtherChanges ?? setInternalOtherChanges;
  const isMinimized = externalIsMinimized ?? internalIsMinimized;
  const _onToggleMinimize = externalOnToggleMinimize ?? (() => setInternalIsMinimized(prev => !prev));

  // Initialize local state with external/internal value
  useEffect(() => {
    if (localOtherChanges === "" && otherChanges !== "") {
      setLocalOtherChanges(otherChanges);
    }
  }, [otherChanges, localOtherChanges]);

  // Debounced handler for otherChanges updates
  const _handleOtherChangesDebounced = useCallback((value: string) => {
    setLocalOtherChanges(value);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout to update actual state after 150ms
    debounceTimeoutRef.current = setTimeout(() => {
      setOtherChanges(value);
    }, 150);
  }, [setOtherChanges]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      // Clean up improvement debounce timeouts
      Object.values(improvementDebounceRefs.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // State for position-specific improvements
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>(checkedImprovements);
  const [improvementInputs, setImprovementInputs] = useState<{ [key: string]: string }>({});

  // Handle improvement checkbox changes
  const _handleImprovementToggle = (improvement: string) => {
    if (selectedImprovements.includes(improvement)) {
      setSelectedImprovements(prev => prev.filter(item => item !== improvement));
      // Remove the input value when unchecked
      const newInputs = { ...improvementInputs };
      delete newInputs[improvement];
      setImprovementInputs(newInputs);
      // Also remove from local state
      const newLocalInputs = { ...localImprovementInputs };
      delete newLocalInputs[improvement];
      setLocalImprovementInputs(newLocalInputs);
      // Clear any pending debounce for this improvement
      if (improvementDebounceRefs.current[improvement]) {
        clearTimeout(improvementDebounceRefs.current[improvement]);
        delete improvementDebounceRefs.current[improvement];
      }
    } else {
      setSelectedImprovements(prev => [...prev, improvement]);
    }
  };

  // Handle improvement input changes with debouncing
  const _handleImprovementInputChange = useCallback((improvement: string, value: string) => {
    // Update local state immediately for responsive UI
    setLocalImprovementInputs(prev => ({
      ...prev,
      [improvement]: value
    }));

    // Clear existing timeout for this improvement
    if (improvementDebounceRefs.current[improvement]) {
      clearTimeout(improvementDebounceRefs.current[improvement]);
    }

    // Set new timeout to update actual state after 200ms
    improvementDebounceRefs.current[improvement] = setTimeout(() => {
      setImprovementInputs(prev => ({
        ...prev,
        [improvement]: value
      }));
    }, 200);
  }, []);

  const handleAdjustForPositionClick = async () => {
    if (!positionDetails.trim()) {
      return;
    }

    onClose();
    await onAdjustForPosition();
  };

  const _handleManualRefinement = async () => {
    if (!otherChanges.trim()) {
      return;
    }

    setHasSubmitted(true);
    await onRefineCV({
      checkedImprovements: [],
      improvementInputs: {},
      missingSkills: "",
      otherChanges: otherChanges.trim(),
    });
  };

  const handleClose = () => {
    if (!externalSetOtherChanges) {
      setInternalOtherChanges("");
    }
    setHasSubmitted(false);
    setSelectedImprovements(checkedImprovements);
    setImprovementInputs({});
    if (!externalOnToggleMinimize) {
      setInternalIsMinimized(false);
    }
    onClose();
  };

  const hasJobDescription = useMemo(() => positionDetails.trim().length > 10, [positionDetails]);
  const _hasOtherChanges = useMemo(() => otherChanges.trim().length > 0, [otherChanges]);

  const actions = (
    <>
      <Button variant="outline" onClick={handleClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleAdjustForPositionClick}
        disabled={!hasJobDescription || isLoading}
        sx={{ minWidth: 180 }}
      >
        {isLoading ? 'Adjusting CV...' : 'Adjust CV for Position'}
      </Button>
    </>
  );

  return (
    <BaseModal
      open={open && !isMinimized}
      onClose={handleClose}
      title="Adjust CV for Position"
      subtitle="Enter a job description to automatically adjust your CV for this specific position"
      maxWidth="md"
      actions={actions}
      disableBackdropClick={isLoading}
      minimizable={false}
    >
      <Box sx={{ mb: 3 }}>
        <TextField
            multiline
            rows={6}
            fullWidth
            label="Job Description"
            placeholder="Paste the job description here. Your CV will be automatically optimized for this position..."
            variant="outlined"
            value={positionDetails}
            onChange={(e) => setPositionDetails(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '14px',
                lineHeight: 1.5,
              },
            }}
          />
          {positionDetails && positionDetails.length > 0 && (
            <Typography
              variant="caption"
              color={positionDetails.length > 10 ? 'success.main' : 'text.secondary'}
              sx={{ mt: 1, display: 'block' }}
            >
              {positionDetails.length} characters
              {positionDetails.length <= 10 && ' (minimum 10 characters required)'}
            </Typography>
          )}
        </Box>




    </BaseModal>
  );
};

export default ManualAdjustmentModal;