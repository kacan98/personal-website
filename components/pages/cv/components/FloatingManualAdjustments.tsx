import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Button from '@/components/ui/Button';
import { useAppDispatch } from '@/redux/hooks';
import { clearCurrentPositionImprovements } from '@/redux/slices/improvementDescriptions';

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
}: FloatingManualAdjustmentsProps) {
  const dispatch = useAppDispatch();

  if (!isVisible) return null;

  const handleApplyChanges = async () => {
    await onApplyChanges();

    // Clear all improvements and close the panel
    dispatch(clearCurrentPositionImprovements());
    onManualOtherChangesChange('');
    onClose();

    // Request new analysis if we have position details
    if (positionDetails && positionDetails.trim().length >= 10) {
      await onRefreshAnalysis();
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
        <Box>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditNoteIcon color="primary" fontSize="small" />
            CV Adjustments
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

      {/* Selected Improvements Display */}
      {hasImprovementDescriptions && (
        <Box sx={{
          mb: 3,
          p: 2,
          backgroundColor: 'rgba(25, 118, 210, 0.05)',
          borderRadius: 1,
          border: '1px solid rgba(25, 118, 210, 0.2)'
        }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
            Selected Improvements with Your Experience:
          </Typography>
          {improvementsWithDescriptions.map((item, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                pb: 2,
                borderBottom: index < improvementsWithDescriptions.length - 1
                  ? '1px solid rgba(0,0,0,0.1)'
                  : 'none'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                • {item.improvement}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', pl: 2 }}>
                &ldquo;{item.description}&rdquo;
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Manual Changes Input */}
      <TextField
        multiline
        rows={3}
        fullWidth
        placeholder="Describe the changes you want to make to your CV... (Ctrl+Enter to apply)"
        variant="outlined"
        value={localManualChanges}
        onChange={(e) => {
          const value = e.target.value;
          onLocalManualChangesChange(value);
          onManualOtherChangesChange(value);
        }}
        onKeyDown={handleKeyDown}
        sx={{
          '& .MuiInputBase-root': {
            fontSize: '14px',
            lineHeight: 1.5,
          },
        }}
      />
    </Box>
  );
}