import { useEffect, useRef, startTransition } from 'react';
import { useLocale } from 'next-intl';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentPosition } from '@/redux/slices/improvementDescriptions';
import { CVSettings } from '@/types';
import { deepClone } from '../components/pages/cv/utils/cvDiffTracker';
import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model';

interface CvEffectsConfig {
  // State
  originalCv: CVSettings | null;
  setOriginalCv: (cv: CVSettings | null) => void;
  reduxCvProps: CVSettings;
  jobDescription?: string;
  positionDetails: string;
  setPositionDetails: (details: string) => void;
  setShouldAdjustCv: (should: boolean) => void;
  snackbarMessage: string | null;
  setCvAdjusted: (adjusted: boolean) => void;
  motivationalLetter: MotivationalLetterResponse | null;
  setEditableMotivationalLetter: (letter: MotivationalLetterResponse | null) => void;
  companyName: string | null;

  // Auth
  isAuthenticated: boolean;
  authLoading: boolean;

  // Functions
  handleAdjustForPosition: (positionDetails: string, checked: string[], selectedLanguage: string) => Promise<void>;
  handleFetchCacheStats: () => Promise<void>;
  openModal: (modal: string) => void;

  // Dependencies
  checked: string[];
  selectedLanguage: string;
  adjustmentWorkflow: any;
}

export function useCvEffects(config: CvEffectsConfig) {
  const locale = useLocale();
  const dispatch = useAppDispatch();

  // Refs for job loading state
  const jobDescriptionReceived = useRef(false);
  const jobLoadingTimeout = useRef<NodeJS.Timeout | null>(null);
  const adjustmentInProgress = useRef(false);
  const lastProcessedPosition = useRef<string | null>(null);

  // Initialize originalCv from Redux (which already has IDs from StoreProvider)
  // Only set originalCv on first load, never update it after that
  const originalCvInitialized = useRef(false);

  useEffect(() => {
    if (!originalCvInitialized.current && !config.originalCv && config.reduxCvProps.name) {
      // Clone the Redux CV as the original for comparison
      // Redux already has IDs applied in StoreProvider, so no need to ensure them again
      const clonedCv = deepClone(config.reduxCvProps);
      console.log('[useCvEffects] Setting originalCv for first time');
      config.setOriginalCv(clonedCv);
      originalCvInitialized.current = true;
    }
  }, [config.reduxCvProps.name, config.originalCv, config.setOriginalCv]); // Only watch for name change and originalCv, not entire reduxCvProps

  // Check for job ID in URL and start loading immediately
  useEffect(() => {
    const currentUrl = window.location.pathname;
    const jobIdMatch = currentUrl.match(/\/cv\/([^\/]+)$/);

    if (jobIdMatch && jobIdMatch[1]) {
      // Job ID detected in URL, start loading immediately
      // Set a timeout to show failure toast if no job description comes within 10 seconds
      jobLoadingTimeout.current = setTimeout(() => {
        if (!jobDescriptionReceived.current) {
          console.log('Failed to load job description. Please try again.');
        }
      }, 10000);
    }

    return () => {
      if (jobLoadingTimeout.current) {
        clearTimeout(jobLoadingTimeout.current);
      }
    };
  }, []);

  // Handle job description received
  useEffect(() => {
    if (config.jobDescription && config.jobDescription.trim().length > 0) {
      // Mark that we received job description
      jobDescriptionReceived.current = true;

      // Clear the failure timeout
      if (jobLoadingTimeout.current) {
        clearTimeout(jobLoadingTimeout.current);
        jobLoadingTimeout.current = null;
      }

      // Use startTransition to mark heavy operations as non-urgent
      startTransition(() => {
        config.setPositionDetails(config.jobDescription || '');
        config.setShouldAdjustCv(true);
      });
    }
  }, [config.jobDescription, config.setPositionDetails, config.setShouldAdjustCv]);

  // Auto-adjust CV when position details are available
  useEffect(() => {
    if (config.positionDetails && config.positionDetails.trim().length > 0) {
      // Wait for auth loading to complete before checking authentication
      if (config.authLoading) {
        return;
      }

      // Prevent execution if already loading or processing
      if (config.adjustmentWorkflow.isLoading || adjustmentInProgress.current) {
        return;
      }

      // Prevent duplicate processing of the same position
      if (lastProcessedPosition.current === config.positionDetails) {
        return;
      }

      // Check authentication before automatically adjusting CV
      if (!config.isAuthenticated) {
        config.openModal('password');
        config.adjustmentWorkflow.resetWorkflow();
        return;
      }

      adjustmentInProgress.current = true;
      lastProcessedPosition.current = config.positionDetails;
      
      config.handleAdjustForPosition(config.positionDetails, config.checked, config.selectedLanguage)
        .finally(() => {
          adjustmentInProgress.current = false;
        });
    }
  }, [
    config.positionDetails,
    config.authLoading,
    config.isAuthenticated,
    config.checked,
    config.selectedLanguage,
    config.handleAdjustForPosition,
    config.openModal,
    config.adjustmentWorkflow.isLoading,
    config.adjustmentWorkflow.resetWorkflow
  ]);

  // Handle CV adjusted flag
  useEffect(() => {
    if (config.snackbarMessage === 'CV personalized with relevant projects and motivational letter generated successfully!') {
      config.setCvAdjusted(true);
    }
  }, [config.snackbarMessage, config.setCvAdjusted]);

  // Sync motivational letter with editable version
  useEffect(() => {
    if (config.motivationalLetter) {
      config.setEditableMotivationalLetter(config.motivationalLetter);
    }
  }, [config.motivationalLetter, config.setEditableMotivationalLetter]);

  // Handle position updates with Redux
  useEffect(() => {
    if (config.positionDetails && config.positionDetails.trim().length > 10 && config.companyName) {
      dispatch(setCurrentPosition({
        positionDetails: config.positionDetails,
        companyName: config.companyName
      }));
    }
  }, [config.positionDetails, config.companyName, dispatch]);

  // Fetch cache stats on component mount
  useEffect(() => {
    config.handleFetchCacheStats();
  }, []); // Empty dependency array - only run on mount

  return {
    jobDescriptionReceived,
    jobLoadingTimeout,
  };
}