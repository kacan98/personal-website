import { useCallback } from 'react';
import { SelectChangeEvent, SnackbarCloseReason } from '@mui/material';
import { useAppDispatch } from '@/redux/hooks';
import { initCv } from '@/redux/slices/cv';
import {
  toggleImprovementSelection,
  updateImprovementDescription,
  markImprovementsAsUsed,
} from '@/redux/slices/improvementDescriptions';
import { CVSettings } from '@/types';
import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model';
import { useModalManager } from './useModalManager';
import { useAuth } from '@/contexts/AuthContext';

interface EventHandlersConfig {
  // State setters
  setLanguage: (lang: string) => void;
  setSnackbarMessage: (msg: string | null) => void;
  setTitleClickedTimes: (count: number) => void;
  setHasManualRefinements: (has: boolean) => void;
  setIsManualAdjustmentMinimized: (minimized: boolean) => void;

  // Current state values
  titleClickedTimes: number;
  isAuthenticated: boolean;
  showPasswordModal: boolean;
  originalCv: CVSettings | null;
  editableMotivationalLetter: MotivationalLetterResponse | null;
  motivationalLetter: MotivationalLetterResponse | null;
  checked: string[];
  improvementsWithDescriptions: Array<{ improvement: string; description: string }>;

  // Redux props
  reduxCvProps: CVSettings;

  // Utility functions
  adjustmentWorkflow: any;
  refineCv: (data: any) => Promise<void>;
  adjustMotivationalLetter: (letter: any, comments: string, position: string, cv: CVSettings, lang: string) => Promise<void>;
}

export function useCvEventHandlers(config: EventHandlersConfig) {
  const dispatch = useAppDispatch();
  const { openModal, closeModal } = useModalManager();
  const { logout } = useAuth();

  // Language change handler
  const handleLanguageChange = useCallback(async (event: SelectChangeEvent<string>) => {
    config.setLanguage(event.target.value);
  }, [config.setLanguage]);

  // Snackbar close handler
  const handleClose = useCallback((
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    config.setSnackbarMessage(null);
  }, [config.setSnackbarMessage]);

  // Title click handler for authentication
  const onTitleClicked = useCallback(() => {
    if (!config.isAuthenticated && !config.showPasswordModal) {
      const newClickCount = config.titleClickedTimes + 1;
      config.setTitleClickedTimes(newClickCount);

      if (newClickCount >= 5) {
        config.setTitleClickedTimes(0);
        openModal('password');
      }
    }
  }, [
    config.isAuthenticated,
    config.showPasswordModal,
    config.titleClickedTimes,
    config.setTitleClickedTimes,
    openModal
  ]);

  // Position adjustment handler
  const handleAdjustForPosition = useCallback(async (positionDetails: string, checked: string[], selectedLanguage: string) => {
    if (positionDetails && positionDetails.trim().length > 0) {
      if (!config.isAuthenticated) {
        openModal('password');
        return;
      }

      try {
        await config.adjustmentWorkflow.startAdjustment(positionDetails, checked, selectedLanguage);
        config.setSnackbarMessage('CV personalized with relevant projects and motivational letter generated successfully!');
      } catch (error) {
        console.error('Error during position adjustment:', error);
        config.setSnackbarMessage('Error during CV personalization or letter generation');
      }
    }
  }, [
    config.isAuthenticated,
    config.adjustmentWorkflow.startAdjustment,
    config.setSnackbarMessage,
    openModal
  ]);

  // Manual refinement handler
  const handleManualRefinement = useCallback(async (refinementData: {
    checkedImprovements: string[];
    improvementInputs: { [key: string]: string };
    missingSkills: string;
    otherChanges: string;
  }) => {
    // Format improvements with AI suggestion + user experience
    const formattedImprovements = config.improvementsWithDescriptions.map(item =>
      `AI suggested: ${item.improvement}\nUser said: ${item.description}`
    );

    const refinementWithDescriptions = {
      ...refinementData,
      checkedImprovements: formattedImprovements.length > 0 ? formattedImprovements : refinementData.checkedImprovements,
      improvementInputs: {
        ...refinementData.improvementInputs,
        ...Object.fromEntries(
          config.improvementsWithDescriptions.map(item => [item.improvement, item.description])
        )
      }
    };

    await config.refineCv(refinementWithDescriptions);
    config.setHasManualRefinements(true);
    closeModal('manualAdjustment');

    // Mark the used improvements
    if (config.checked.length > 0) {
      dispatch(markImprovementsAsUsed(config.checked));
    }
  }, [
    config.improvementsWithDescriptions,
    config.refineCv,
    config.setHasManualRefinements,
    config.checked,
    closeModal,
    dispatch
  ]);

  // Letter adjustment handler
  const handleAdjustLetter = useCallback(async (comments: string, positionDetails: string, selectedLanguage: string) => {
    const currentLetter = config.editableMotivationalLetter || config.motivationalLetter;
    if (currentLetter) {
      await config.adjustMotivationalLetter(
        currentLetter,
        comments,
        positionDetails,
        config.reduxCvProps,
        selectedLanguage
      );
    }
  }, [
    config.editableMotivationalLetter,
    config.motivationalLetter,
    config.adjustMotivationalLetter,
    config.reduxCvProps
  ]);

  // Improvement checkbox handler
  const handleChecked = useCallback((value: string) => () => {
    dispatch(toggleImprovementSelection(value));
  }, [dispatch]);

  // Improvement description handler
  const handleImprovementDescriptionChange = useCallback((improvementKey: string, description: string) => {
    dispatch(updateImprovementDescription({
      improvementKey,
      userDescription: description,
      selected: config.checked.includes(improvementKey)
    }));
  }, [config.checked, dispatch]);

  // Copy CV JSON to clipboard
  const handleCopyJsonToClipboard = useCallback(async () => {
    try {
      const jsonData = JSON.stringify(config.reduxCvProps, null, 2);
      await navigator.clipboard.writeText(jsonData);
      config.setSnackbarMessage('CV JSON copied to clipboard successfully');
    } catch (error) {
      config.setSnackbarMessage('Failed to copy CV JSON to clipboard');
    }
  }, [config.reduxCvProps, config.setSnackbarMessage]);

  // Reset CV to original
  const handleResetToOriginal = useCallback(() => {
    if (config.originalCv) {
      dispatch(initCv(config.originalCv));
    }
  }, [config.originalCv, dispatch]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    await logout();
    config.setSnackbarMessage('Logged out successfully');
  }, [logout, config]);

  return {
    handleLanguageChange,
    handleClose,
    onTitleClicked,
    handleAdjustForPosition,
    handleManualRefinement,
    handleAdjustLetter,
    handleChecked,
    handleImprovementDescriptionChange,
    handleCopyJsonToClipboard,
    handleResetToOriginal,
    handleLogout,
  };
}