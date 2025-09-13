"use client";
import {
  TextField,
  Typography,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Collapse,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  EditNote as EditNoteIcon,
  Minimize as MinimizeIcon,
} from "@mui/icons-material";
import { useState } from "react";
import Button from "@/components/ui/Button";
import BaseModal from "./BaseModal";
import { JobCvIntersectionResponse } from "@/app/api/job-cv-intersection/model";

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
  companyName?: string | null;
  positionIntersection?: JobCvIntersectionResponse | null;
  positionDetails: string;
  setPositionDetails: (value: string) => void;
  onAnalyzePosition: () => Promise<void>;
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
  companyName,
  positionIntersection,
  positionDetails,
  setPositionDetails,
  onAnalyzePosition,
  isMinimized: externalIsMinimized,
  onToggleMinimize: externalOnToggleMinimize,
  otherChanges: externalOtherChanges,
  setOtherChanges: externalSetOtherChanges,
}: ManualAdjustmentModalProps) => {
  const [internalOtherChanges, setInternalOtherChanges] = useState("");
  const [_hasSubmitted, setHasSubmitted] = useState(false);
  const [internalIsMinimized, setInternalIsMinimized] = useState(false);

  // Use external state if provided, otherwise use internal state
  const otherChanges = externalOtherChanges ?? internalOtherChanges;
  const setOtherChanges = externalSetOtherChanges ?? setInternalOtherChanges;
  const isMinimized = externalIsMinimized ?? internalIsMinimized;
  const _onToggleMinimize = externalOnToggleMinimize ?? (() => setInternalIsMinimized(prev => !prev));

  // State for position-specific improvements
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>(checkedImprovements);
  const [improvementInputs, setImprovementInputs] = useState<{ [key: string]: string }>({});

  // Handle improvement checkbox changes
  const handleImprovementToggle = (improvement: string) => {
    if (selectedImprovements.includes(improvement)) {
      setSelectedImprovements(prev => prev.filter(item => item !== improvement));
      // Remove the input value when unchecked
      const newInputs = { ...improvementInputs };
      delete newInputs[improvement];
      setImprovementInputs(newInputs);
    } else {
      setSelectedImprovements(prev => [...prev, improvement]);
    }
  };

  // Handle improvement input changes
  const handleImprovementInputChange = (improvement: string, value: string) => {
    setImprovementInputs(prev => ({
      ...prev,
      [improvement]: value
    }));
  };

  const handleSubmit = async () => {
    if (!otherChanges.trim() && selectedImprovements.length === 0) {
      return;
    }

    setHasSubmitted(true);
    await onRefineCV({
      checkedImprovements: selectedImprovements,
      improvementInputs,
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

  const hasContent = otherChanges.trim() || selectedImprovements.length > 0;

  const actions = (
    <>
      <Button variant="outline" onClick={onClose} disabled={isLoading}>
        Close
      </Button>
      <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={!hasContent || isLoading}
        sx={{ minWidth: 140 }}
      >
        {isLoading ? 'Refining CV...' : 'Refine CV'}
      </Button>
    </>
  );

  return (
    <BaseModal
      open={open && !isMinimized}
      onClose={handleClose}
      title="Manual CV Adjustments"
      subtitle={companyName ? `Fine-tune your CV for ${companyName}` : "Fine-tune your personalized CV"}
      maxWidth="md"
      actions={actions}
      disableBackdropClick={isLoading}
      minimizable={false}
    >
      {/* Job Description Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon color="primary" fontSize="small" />
          Position Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add a job description to get specific improvement suggestions based on the role requirements.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Job Description (Optional)"
            placeholder="Paste job description here to get position-specific improvement suggestions..."
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
            </Typography>
          )}
        </Box>

        {positionDetails && positionDetails.trim().length > 10 && (
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="primary"
              onClick={onAnalyzePosition}
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing Position...' : positionIntersection ? 'Re-analyze Position' : 'Analyze Position for Suggestions'}
            </Button>
            {positionIntersection && (
              <Typography variant="body2" sx={{ alignSelf: 'center', color: 'success.main' }}>
                ✓ Analysis complete - see suggestions below
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Position-Based Improvements Section */}
      {positionIntersection && positionIntersection.whatIsMissing?.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="primary" fontSize="small" />
            Position-Specific Improvements
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select improvements that apply to you and provide details about your actual experience:
          </Typography>

          <List sx={{ py: 0 }}>
            {positionIntersection.whatIsMissing.map((missing, index) => {
              const isSelected = selectedImprovements.includes(missing.description);
              return (
                <Box key={index} sx={{ mb: 2 }}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 3,
                      border: '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      borderRadius: 2,
                      backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleImprovementToggle(missing.description)}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        checked={isSelected}
                        color="primary"
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 400, mb: 1 }}>
                          {missing.description}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {missing.whatWouldImproveTheCv}
                        </Typography>
                      }
                    />
                  </ListItem>

                  {/* Dynamic input field for selected improvements */}
                  <Collapse in={isSelected}>
                    <Box sx={{ mt: 2, ml: 4, mr: 0 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Describe your actual experience with this skill/requirement..."
                        variant="outlined"
                        size="small"
                        value={improvementInputs[missing.description] || ''}
                        onChange={(e) => handleImprovementInputChange(missing.description, e.target.value)}
                        sx={{
                          '& .MuiInputBase-root': {
                            fontSize: '14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          },
                        }}
                      />
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </List>
        </Box>
      )}

      {/* Legacy Selected Improvements (fallback when no positionIntersection) */}
      {!positionIntersection && checkedImprovements.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" fontSize="small" />
            Selected Improvements
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These improvements from the position analysis will be incorporated:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {checkedImprovements.map((improvement, index) => (
              <Chip
                key={index}
                label={improvement}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ maxWidth: 300 }}
              />
            ))}
          </Box>
        </Box>
      )}


      {/* Other Changes Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditNoteIcon color="primary" fontSize="small" />
            Other Specific Changes
          </Typography>
          <Button
            variant="outline"
            onClick={externalOnToggleMinimize || (() => setInternalIsMinimized(prev => !prev))}
            startIcon={<MinimizeIcon />}
            size="small"
            sx={{ ml: 2 }}
          >
            Continue editing at bottom
          </Button>
        </Box>
        <TextField
          multiline
          rows={5}
          fullWidth
          placeholder="Examples:
• Emphasize my leadership experience more prominently
• Add more technical details about my backend projects
• Highlight my startup experience for this entrepreneurial role
• Make the summary more concise and impactful
• Reorganize work experience to show most relevant roles first"
          variant="outlined"
          value={otherChanges}
          onChange={(e) => setOtherChanges(e.target.value)}
          sx={{
            '& .MuiInputBase-root': {
              fontSize: '14px',
              lineHeight: 1.5,
            },
          }}
        />
        {otherChanges && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {otherChanges.length} characters
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Instructions */}
    </BaseModal>
  );
};

export default ManualAdjustmentModal;