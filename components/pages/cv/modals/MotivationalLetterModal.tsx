"use client";
import {
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import {
  GetApp as GetAppIcon,
  Edit as EditIcon,
  AutoFixHigh as AutoFixHighIcon,
  Translate as TranslateIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import BaseModal from "./BaseModal";
import { MotivationalLetterResponse } from "@/app/api/motivational-letter/motivational-letter.model";
import CvLanguageSelectionComponent from "../languageSelect";

interface MotivationalLetterModalProps {
  open: boolean;
  onClose: () => void;
  motivationalLetter: MotivationalLetterResponse | null;
  editableMotivationalLetter: MotivationalLetterResponse | null;
  setEditableMotivationalLetter: (letter: MotivationalLetterResponse | null) => void;
  onDownloadPDF: () => void;
  onAdjustLetter: (comments: string) => Promise<void>;
  onTranslateLetter: () => Promise<void>;
  onGenerateLetter: (positionDetails: string, checkedItems: string[], language: string) => Promise<void>;
  selectedLanguage: string;
  handleLanguageChange: (event: any) => void;
  isLoading: boolean;
  companyName?: string | null;
  positionDetails: string;
  setPositionDetails: (value: string) => void;
  checked: string[];
  _handleChecked: (item: string) => () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`letter-tabpanel-${index}`}
      aria-labelledby={`letter-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const MotivationalLetterModal = ({
  open,
  onClose,
  motivationalLetter,
  editableMotivationalLetter,
  setEditableMotivationalLetter,
  onDownloadPDF,
  onAdjustLetter,
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
}: MotivationalLetterModalProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState("");
  const [adjustmentComments, setAdjustmentComments] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);

  const letterToShow = editableMotivationalLetter || motivationalLetter;

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
    const sections = text.split('\n\n').map(section => section.trim()).filter(section => section);
    let greeting = '', opening = '', whyThisRole = '';
    const keyStrengths: string[] = [];
    let uniqueValue = '', closing = '', signature = '';
    let keyStrengthsIndex = -1;

    // Find key strengths section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.toLowerCase().includes('key strengths:') || section.toLowerCase().includes('why i\'m a good fit:')) {
        keyStrengthsIndex = i;
        const lines = section.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('•')) {
            keyStrengths.push(line.replace(/^•\s*/, '').trim());
          }
        }
        break;
      }
    }

    // Assign other sections
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (i === keyStrengthsIndex) continue;

      if (i === sections.length - 1 && section.length < 50) {
        signature = section;
        continue;
      }

      if (section.toLowerCase().includes('sincerely') || section.toLowerCase().includes('best regards')) {
        closing = section;
        continue;
      }

      if (keyStrengthsIndex === -1) {
        if (i === 0) greeting = section;
        else if (i === 1) opening = section;
        else if (i === 2) whyThisRole = section;
        else if (i === 3) uniqueValue = section;
      } else {
        if (i < keyStrengthsIndex) {
          if (i === 0) greeting = section;
          else if (i === 1) opening = section;
          else if (i === 2) whyThisRole = section;
        } else {
          if (!uniqueValue) uniqueValue = section;
          else if (!closing) closing = section;
          else if (!signature) signature = section;
        }
      }
    }

    return { greeting, opening, whyThisRole, keyStrengths, uniqueValue, closing, signature };
  };

  useEffect(() => {
    if (letterToShow && !isEditing) {
      setEditableText(convertLetterToText(letterToShow));
    }
  }, [letterToShow, isEditing]);

  const handleStartEditing = () => {
    if (letterToShow) {
      setEditableText(convertLetterToText(letterToShow));
      setIsEditing(true);
    }
  };

  const handleSaveEditing = () => {
    if (editableText) {
      const parsedLetter = convertTextToLetter(editableText);
      setEditableMotivationalLetter(parsedLetter);
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
    if (!adjustmentComments.trim()) return;

    setIsAdjusting(true);
    try {
      await onAdjustLetter(adjustmentComments);
      setAdjustmentComments('');
    } finally {
      setIsAdjusting(false);
    }
  };

  const renderLetterContent = () => {
    if (!letterToShow) return null;

    return (
      <Box sx={{ fontSize: '16px', lineHeight: 1.6 }}>
        {letterToShow.greeting && (
          <Box sx={{ whiteSpace: 'pre-line', mb: 2 }}>
            {letterToShow.greeting}
          </Box>
        )}

        {letterToShow.opening && (
          <Box sx={{ whiteSpace: 'pre-line', mb: 3 }}>
            {letterToShow.opening}
          </Box>
        )}

        {letterToShow.whyThisRole && (
          <Box sx={{ whiteSpace: 'pre-line', mb: 3 }}>
            {letterToShow.whyThisRole}
          </Box>
        )}

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

        {letterToShow.uniqueValue && (
          <Box sx={{ whiteSpace: 'pre-line', mb: 3 }}>
            {letterToShow.uniqueValue}
          </Box>
        )}

        {letterToShow.closing && (
          <Box sx={{ whiteSpace: 'pre-line', mb: 2 }}>
            {letterToShow.closing}
          </Box>
        )}

        {letterToShow.signature && (
          <Box sx={{ whiteSpace: 'pre-line' }}>
            {letterToShow.signature}
          </Box>
        )}
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
      fullScreen
    >
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
            {letterToShow ? [
              <Tab key="edit" label="View & Edit" />,
              <Tab key="adjust" label="AI Adjustments" />,
              <Tab key="translate" label="Translation" />
            ] : [
              <Tab key="generate" label="Generate Letter" />,
              <Tab key="translate" label="Translation" />
            ]}
          </Tabs>
        </Box>

          {/* Generate Letter Tab (when no letter exists) */}
          {!letterToShow && (
            <TabPanel value={currentTab} index={0}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Generate Motivational Letter
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create a personalized motivational letter based on your CV and position requirements.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Job Description or Position Details
                </Typography>
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  label="Position Details"
                  placeholder="Paste the job description or describe the position you're applying for..."
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

              <Button
                variant="primary"
                onClick={() => onGenerateLetter(positionDetails, checked, selectedLanguage)}
                disabled={!positionDetails || positionDetails.trim().length < 10 || isLoading}
                sx={{ minWidth: 180 }}
              >
                {isLoading ? 'Generating Letter...' : 'Generate Motivational Letter'}
              </Button>

            </TabPanel>
          )}

          {/* View & Edit Tab (when letter exists) */}
          {letterToShow && (
            <TabPanel value={currentTab} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Letter Content</Typography>
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
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
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
                  minHeight: 400
                }}
                onClick={handleStartEditing}
              >
                <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary', mb: 2, fontStyle: 'italic' }}>
                  Click to edit
                </Typography>
                {renderLetterContent()}
              </Box>
            )}
          </TabPanel>
          )}

          {/* AI Adjustments Tab (only when letter exists) */}
          {letterToShow && (
            <TabPanel value={currentTab} index={1}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Request AI Adjustments
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Provide specific feedback about how you&apos;d like the letter to be improved. The AI will analyze your CV to highlight relevant skills and experience that match the job requirements.
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={6}
              value={adjustmentComments}
              onChange={(e) => setAdjustmentComments(e.target.value)}
              placeholder="Examples:
• Highlight my React experience more prominently
• Emphasize my leadership skills and team management experience
• Connect my backend experience to their tech stack requirements
• Make it more specific to this particular role and company
• Add more enthusiasm and personality to the tone"
              sx={{ mb: 3 }}
              variant="outlined"
            />

            <Button
              variant="primary"
              startIcon={<AutoFixHighIcon />}
              onClick={handleAdjustWithComments}
              disabled={!adjustmentComments.trim() || isAdjusting || isLoading}
              sx={{ minWidth: 180 }}
            >
              {isAdjusting ? 'Adjusting Letter...' : 'Submit Feedback & Adjust'}
            </Button>
          </TabPanel>
          )}

          {/* Translation Tab */}
          <TabPanel value={currentTab} index={letterToShow ? 2 : 1}>
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

            {!letterToShow && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Generate a motivational letter first to enable translation.
              </Alert>
            )}
          </TabPanel>
      </>
    </BaseModal>
  );
};

export default MotivationalLetterModal;