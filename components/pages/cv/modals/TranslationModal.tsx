"use client";
import {
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from "@mui/material";
import {
  Translate as TranslateIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useState } from "react";
import Button from "@/components/ui/Button";
import BaseModal from "./BaseModal";
import CvLanguageSelectionComponent from "../languageSelect";

interface TranslationModalProps {
  open: boolean;
  onClose: () => void;
  selectedLanguage: string;
  handleLanguageChange: (event: any) => void;
  onTranslateBoth: () => Promise<void>;
  hasMotivationalLetter: boolean;
  isLoading: boolean;
}

const TranslationModal = ({
  open,
  onClose,
  selectedLanguage,
  handleLanguageChange,
  onTranslateBoth,
  hasMotivationalLetter,
  isLoading,
}: TranslationModalProps) => {
  const [translateCV, setTranslateCV] = useState(true);
  const [translateLetter, setTranslateLetter] = useState(hasMotivationalLetter);

  const canTranslate = selectedLanguage !== 'English' && (translateCV || (translateLetter && hasMotivationalLetter));

  const handleTranslate = async () => {
    if (canTranslate) {
      await onTranslateBoth();
    }
  };

  const actions = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        variant="primary"
        startIcon={<TranslateIcon />}
        onClick={handleTranslate}
        disabled={!canTranslate || isLoading}
        sx={{ minWidth: 140 }}
      >
        {isLoading ? 'Translating...' : 'Translate'}
      </Button>
    </>
  );

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Translate CV & Letter"
      subtitle="Convert your CV and motivational letter to another language"
      maxWidth="sm"
      actions={actions}
      disableBackdropClick={isLoading}
    >
      {/* Language Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select Target Language
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose the language you want to translate your documents to. The AI will maintain professional tone and structure while adapting to cultural norms.
        </Typography>
        <CvLanguageSelectionComponent
          selectedLanguage={selectedLanguage}
          handleLanguageChange={handleLanguageChange}
        />
      </Box>

      {/* What to Translate */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          What to Translate
        </Typography>
        <List sx={{ py: 0 }}>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemIcon>
              <Checkbox
                checked={translateCV}
                onChange={(e) => setTranslateCV(e.target.checked)}
                color="primary"
              />
            </ListItemIcon>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <DescriptionIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="CV/Resume"
              secondary="Translate your complete CV including all sections and content"
            />
          </ListItem>

          {hasMotivationalLetter && (
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemIcon>
                <Checkbox
                  checked={translateLetter}
                  onChange={(e) => setTranslateLetter(e.target.checked)}
                  color="primary"
                />
              </ListItemIcon>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Motivational Letter"
                secondary="Translate your motivational letter maintaining its professional tone"
              />
            </ListItem>
          )}
        </List>
      </Box>

      {/* Validation Messages */}
      {selectedLanguage === 'English' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Please select a different language to translate your documents.
        </Alert>
      )}

      {!translateCV && (!translateLetter || !hasMotivationalLetter) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please select at least one document to translate.
        </Alert>
      )}

      {!hasMotivationalLetter && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>No motivational letter available.</strong> Generate one by adjusting your CV for a specific position to enable letter translation.
          </Typography>
        </Alert>
      )}

      {/* Translation Info */}
    </BaseModal>
  );
};

export default TranslationModal;