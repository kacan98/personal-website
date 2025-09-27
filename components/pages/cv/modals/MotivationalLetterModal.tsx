"use client";
import {
  TextField,
  Typography,
  Box,
  Alert,
  SelectChangeEvent,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  GetApp as GetAppIcon,
  Edit as EditIcon,
  AutoFixHigh as AutoFixHighIcon,
  Translate as TranslateIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useState, useEffect, useCallback, useRef } from "react";
import Button from "@/components/ui/Button";
import BaseModal from "./BaseModal";
import { MotivationalLetterResponse } from "@/app/api/motivational-letter/motivational-letter.model";
import CvLanguageSelectionComponent from "../languageSelect";
import { useFreeformLetterAdjustment } from "../hooks/useFreeformLetterAdjustment";
import { CVSettings } from "@/types";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface MotivationalLetterModalProps {
  open: boolean;
  onClose: () => void;
  motivationalLetter: MotivationalLetterResponse | null;
  editableMotivationalLetter: MotivationalLetterResponse | null;
  setEditableMotivationalLetter: (letter: MotivationalLetterResponse | null) => void;
  onDownloadPDF: () => void;
  _onAdjustLetter: (comments: string) => Promise<void>;
  onTranslateLetter: () => Promise<void>;
  onGenerateLetter: (positionDetails: string, checkedItems: string[], language: string) => Promise<void>;
  selectedLanguage: string;
  handleLanguageChange: (event: SelectChangeEvent<string>) => void;
  isLoading: boolean;
  companyName?: string | null;
  positionDetails: string;
  setPositionDetails: (value: string) => void;
  checked: string[];
  _handleChecked: (item: string) => () => void;
  candidate?: CVSettings;
}


const MotivationalLetterModal = ({
  open,
  onClose,
  motivationalLetter,
  editableMotivationalLetter,
  setEditableMotivationalLetter,
  onDownloadPDF,
  _onAdjustLetter,
  onTranslateLetter,
  onGenerateLetter,
  selectedLanguage,
  handleLanguageChange,
  isLoading,
  companyName,
  positionDetails,
  setPositionDetails,
  checked,
  _handleChecked,
  candidate,
}: MotivationalLetterModalProps) => {
  const router = useRouter();
  const locale = useLocale();
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState("");
  const [localEditableText, setLocalEditableText] = useState("");
  const [adjustmentComments, setAdjustmentComments] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const editableTextDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined);


  const letterToShow = editableMotivationalLetter || motivationalLetter;

  // Hook for freeform letter adjustment
  const { adjustLetterFreeform } = useFreeformLetterAdjustment({
    setMotivationalLetter: setEditableMotivationalLetter,
    positionDetails,
    candidate,
    strongPoints: checked,
  });

  // Simple text conversion functions
  const convertLetterToText = (letter: MotivationalLetterResponse): string => {
    return letter.letter || '';
  };

  const convertTextToLetter = (text: string): MotivationalLetterResponse => {
    return { letter: text };
  };

  useEffect(() => {
    if (letterToShow && !isEditing) {
      const text = convertLetterToText(letterToShow);
      setEditableText(text);
      setLocalEditableText(text);
    }
  }, [letterToShow, isEditing]);

  const handleStartEditing = () => {
    if (letterToShow) {
      setEditableText(convertLetterToText(letterToShow));
      setIsEditing(true);
    }
  };

  // Debounced handler for editable text updates
  const handleEditableTextDebounced = useCallback((value: string) => {
    setLocalEditableText(value);

    // Clear existing timeout
    if (editableTextDebounceRef.current) {
      clearTimeout(editableTextDebounceRef.current);
    }

    // Set new timeout to update actual state after 200ms
    editableTextDebounceRef.current = setTimeout(() => {
      setEditableText(value);
    }, 200);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (editableTextDebounceRef.current) {
        clearTimeout(editableTextDebounceRef.current);
      }
    };
  }, []);

  const handleSaveEditing = () => {
    // Use local text for immediate save, then sync with editableText
    const textToSave = localEditableText || editableText;
    if (textToSave) {
      const parsedLetter = convertTextToLetter(textToSave);
      setEditableMotivationalLetter(parsedLetter);
      setEditableText(textToSave); // Ensure sync
    }
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    if (letterToShow) {
      setEditableText(convertLetterToText(letterToShow));
    }
  };

  const handleAdjustWithComments = async () => {
    if (!adjustmentComments.trim() || !letterToShow) return;

    setIsAdjusting(true);
    try {
      // Get current letter as text
      const currentLetterText = convertLetterToText(letterToShow);

      // Use freeform adjustment
      await adjustLetterFreeform(currentLetterText, adjustmentComments.trim());

      // Clear the input
      setAdjustmentComments('');
    } catch (error) {
      console.error('Error adjusting letter:', error);
      // Could add error handling here
    } finally {
      setIsAdjusting(false);
    }
  };


  const renderSelectedStories = () => {
    if (!letterToShow?.selectedStories || letterToShow.selectedStories.length === 0) return null;

    return (
      <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Stories Used in This Letter
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The AI selected these project stories as most relevant to the job description and included them in your letter:
        </Typography>

        {letterToShow.selectionReasoning && (
          <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic', color: 'text.secondary' }}>
            &quot;{letterToShow.selectionReasoning}&quot;
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {letterToShow.selectedStories.map((story) => (
            <Card key={story.id} variant="outlined" sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {story.title}
                    </Typography>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => router.push(`/${locale}${story.url || ''}`)}
                      sx={{ minWidth: 'auto', p: 0.5, fontSize: '0.75rem' }}
                    >
                      View Story →
                    </Button>
                  </Box>
                  <Chip
                    label={`${Math.round(story.relevance * 100)}% match`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip label={story.category} size="small" color="secondary" />
                  {story.metrics?.impact && (
                    <Typography variant="caption" color="text.secondary">
                      Impact: {story.metrics.impact}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {story.tags.slice(0, 6).map(tag => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                  {story.tags.length > 6 && (
                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', ml: 0.5 }}>
                      +{story.tags.length - 6} more
                    </Typography>
                  )}
                </Box>

                {story.fullUrl && (
                  <Box sx={{
                    p: 1,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', flexGrow: 1 }}>
                      {story.fullUrl}
                    </Typography>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => navigator.clipboard.writeText(story.fullUrl)}
                      sx={{ minWidth: 'auto', p: 0.5, fontSize: '0.7rem' }}
                    >
                      Copy
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  };

  const renderLetterContent = () => {
    if (!letterToShow) return null;

    return (
      <Box sx={{ fontSize: '16px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
        {letterToShow.letter}
      </Box>
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Motivational Letter"
      subtitle={companyName ? `Generated for ${companyName}` : "AI-generated motivational letter"}
      maxWidth="lg"
    >
      <>
        {/* Main content area with persistent feedback input */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          height: letterToShow ? 'calc(100vh - 200px)' : 'auto',
          pb: letterToShow ? 2 : 0
        }}>
          {/* Scrollable content area */}
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            mb: letterToShow ? 2 : 0,
            pr: 1
          }}>

          {/* Generate Letter Section (when no letter exists) */}
          {!letterToShow && (
            <>

              <Box sx={{ mb: 3 }}>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  label="Position Details"
                  placeholder="Paste the job description or describe the position you're applying for... (Ctrl+Enter to generate)"
                  variant="outlined"
                  value={positionDetails}
                  onChange={(e) => setPositionDetails(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                      e.preventDefault();
                      if (positionDetails && positionDetails.trim().length >= 10 && !isLoading) {
                        onGenerateLetter(positionDetails, checked, selectedLanguage);
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

              <Button
                variant="primary"
                onClick={() => onGenerateLetter(positionDetails, checked, selectedLanguage)}
                disabled={!positionDetails || positionDetails.trim().length < 10 || isLoading}
                sx={{ minWidth: 180 }}
              >
                {isLoading ? 'Generating Letter...' : 'Generate Motivational Letter'}
              </Button>
            </>
          )}

          {/* View & Edit Section (when letter exists) */}
          {letterToShow && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {isEditing ? (
                    <>
                      <Button variant="secondary" onClick={handleCancelEditing}>
                        Cancel
                      </Button>
                      <Button variant="primary" onClick={handleSaveEditing}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        startIcon={<EditIcon />}
                        onClick={handleStartEditing}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="primary"
                        startIcon={<GetAppIcon />}
                        onClick={onDownloadPDF}
                      >
                        Download PDF
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  value={localEditableText}
                  onChange={(e) => handleEditableTextDebounced(e.target.value)}
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
                    p: 3,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    },
                    minHeight: 400,
                    mb: 4
                  }}
                  onClick={handleStartEditing}
                >
                  <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', mb: 2, fontStyle: 'italic' }}>
                    Click to edit
                  </Typography>
                  {renderLetterContent()}
                </Box>
              )}

              {/* Selected Stories Section */}
              {renderSelectedStories()}

              {/* Translation Section */}
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Translate Letter
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Select a language to translate your motivational letter while maintaining its professional tone and structure.
                </Typography>

                <Box sx={{ mb: 3, maxWidth: 300 }}>
                  <CvLanguageSelectionComponent
                    selectedLanguage={selectedLanguage}
                    handleLanguageChange={handleLanguageChange}
                  />
                </Box>

                <Button
                  variant="primary"
                  startIcon={<TranslateIcon />}
                  onClick={onTranslateLetter}
                  disabled={selectedLanguage === 'English' || isLoading}
                  sx={{ minWidth: 160 }}
                >
                  Translate Letter
                </Button>

                {selectedLanguage === 'English' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Please select a different language to translate the letter.
                  </Alert>
                )}
              </Box>
            </>
          )}
          </Box>

          {/* Persistent feedback input at bottom (only when letter exists) */}
          {letterToShow && (
            <Box sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              pt: 2,
              backgroundColor: 'background.paper',
              flexShrink: 0
            }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Adjustments
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={adjustmentComments}
                  onChange={(e) => setAdjustmentComments(e.target.value)}
                  placeholder="Describe how you want to modify the letter (e.g., 'make it shorter', 'more casual', 'bullet points')... (Ctrl+Enter to apply)"
                  variant="outlined"
                  size="small"
                  onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                      e.preventDefault();
                      if (adjustmentComments.trim() && !isAdjusting && !isLoading) {
                        handleAdjustWithComments();
                      }
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '14px',
                      lineHeight: 1.4,
                    }
                  }}
                />
                <Button
                  variant="primary"
                  startIcon={<AutoFixHighIcon />}
                  onClick={handleAdjustWithComments}
                  disabled={!adjustmentComments.trim() || isAdjusting || isLoading}
                  sx={{
                    minWidth: 140,
                    height: 'fit-content',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isAdjusting ? 'Adjusting...' : 'Apply Changes'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </>
    </BaseModal>
  );
};

export default MotivationalLetterModal;