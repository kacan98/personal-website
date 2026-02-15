import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Typography, TextField, FormControlLabel, Checkbox } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearUsedImprovements } from '@/redux/slices/improvementDescriptions';
import { setIncludeOriginalCv, setIncludePositionDetails } from '@/redux/slices/ui';

interface FloatingManualAdjustmentsProps {
  isVisible: boolean;
  checked: string[];
  hasImprovementDescriptions: boolean;
  improvementsWithDescriptions: Array<{
    improvement: string;
    description: string;
  }>;
  localManualChanges: string;
  manualOtherChanges: string;
  loading: boolean;
  positionDetails: string;
  onLocalManualChangesChange: (value: string) => void;
  onManualOtherChangesChange: (value: string) => void;
  onClose: () => void;
  onApplyChanges: () => Promise<void>;
  onRefreshAnalysis: () => Promise<void>;
  onOpenModal: () => void;
}

export function FloatingManualAdjustments({
  isVisible,
  checked,
  hasImprovementDescriptions,
  improvementsWithDescriptions,
  localManualChanges,
  manualOtherChanges,
  loading,
  positionDetails,
  onLocalManualChangesChange,
  onManualOtherChangesChange,
  onClose,
  onApplyChanges,
  onRefreshAnalysis,
  onOpenModal,
}: FloatingManualAdjustmentsProps) {
  const dispatch = useAppDispatch();
  const includeOriginalCv = useAppSelector(state => state.ui?.includeOriginalCv ?? false);
  const includePositionDetails = useAppSelector(state => state.ui?.includePositionDetails ?? false);
  const [localInputValue, setLocalInputValue] = useState(localManualChanges);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Initialize local value with props
  useEffect(() => {
    if (localInputValue !== localManualChanges) {
      setLocalInputValue(localManualChanges);
    }
  }, [localManualChanges]);

  // Debounced handler for input changes
  const handleInputChange = useCallback((value: string) => {
    setLocalInputValue(value);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout to update parent state after 200ms
    debounceTimeoutRef.current = setTimeout(() => {
      onLocalManualChangesChange(value);
      onManualOtherChangesChange(value);
    }, 200);
  }, [onLocalManualChangesChange, onManualOtherChangesChange]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  const handleApplyChanges = async () => {
    try {
      await onApplyChanges();

      // Only close modal if changes were applied successfully
      // Clear used improvements (those that were applied) and close the panel
      dispatch(clearUsedImprovements());
      onManualOtherChangesChange('');
      onClose();

      // Request new analysis if we have position details
      if (positionDetails && positionDetails.trim().length >= 10) {
        await onRefreshAnalysis();
      }
    } catch (error) {
      // Modal stays open on error so user can see the error message and retry
      console.error('Failed to apply changes:', error);
      // Error is shown in snackbar via onApplyChanges callback
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      if ((manualOtherChanges.trim() || hasImprovementDescriptions) && !loading) {
        await handleApplyChanges();
      }
    }
  };

  return (
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
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditNoteIcon color="primary" fontSize="small" />
            CV Adjustments
          </Typography>
          {checked.length > 0 && (
            <Typography variant="caption" sx={{ color: 'text.secondary', ml: 3 }}>
              {checked.length} position improvement{checked.length !== 1 ? 's' : ''} selected
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outline"
            size="small"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </Button>
          <Button
            variant="primary"
            size="small"
            loading={loading}
            onClick={handleApplyChanges}
            disabled={(!manualOtherChanges.trim() && !hasImprovementDescriptions) || loading}
          >
            {hasImprovementDescriptions
              ? `Apply Changes (${improvementsWithDescriptions.length} improvements)`
              : 'Apply Changes'
            }
          </Button>
        </Box>
      </Box>

      {/* Selected Improvements Button */}
      {hasImprovementDescriptions && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outline"
            size="small"
            onClick={onOpenModal}
            startIcon={<InfoOutlinedIcon />}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
              borderColor: 'rgba(25, 118, 210, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
              }
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {improvementsWithDescriptions.length} improvement{improvementsWithDescriptions.length !== 1 ? 's' : ''} with your experience
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Click to view or edit in the analysis modal
              </Typography>
            </Box>
          </Button>
        </Box>
      )}

      {/* Manual Changes Input */}
      <TextField
        multiline
        rows={3}
        fullWidth
        placeholder="Describe the changes you want to make to your CV... (Ctrl+Enter to apply)"
        variant="outlined"
        value={localInputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          '& .MuiInputBase-root': {
            fontSize: '14px',
            lineHeight: 1.5,
          },
        }}
      />

      {/* AI Context Options */}
      <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'rgba(25, 118, 210, 0.04)', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
          Send to AI alongside current CV:
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={includeOriginalCv}
              onChange={(e) => dispatch(setIncludeOriginalCv(e.target.checked))}
              size="small"
            />
          }
          label={
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Original CV (as baseline to avoid hallucinations)
            </Typography>
          }
          sx={{ display: 'flex', mb: 1 }}
        />

        {positionDetails && positionDetails.trim().length > 10 && (
          <FormControlLabel
            control={
              <Checkbox
                checked={includePositionDetails}
                onChange={(e) => dispatch(setIncludePositionDetails(e.target.checked))}
                size="small"
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Position details (for better context, optional)
              </Typography>
            }
            sx={{ display: 'flex' }}
          />
        )}
      </Box>
    </Box>
  );
}