import { useState } from 'react';
import { CVSettings } from '@/types';
import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model';
import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model';
import { CacheStats } from '@/services/cacheService';

/**
 * Centralized state management for CV page
 * Consolidates 25+ useState declarations into a single hook
 */
export function useCvPageState() {
  // Core CV state
  const [originalCv, setOriginalCv] = useState<CVSettings | null>(null);
  const [showDiff, setShowDiff] = useState(true);
  const [loading, setLoading] = useState(false);

  // Language and localization
  const [selectedLanguage, setLanguage] = useState("English");

  // Notifications
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  // Authentication
  const [titleClickedTimes, setTitleClickedTimes] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  // Position and job details
  const [positionSummary, setPositionSummary] = useState<string>('');
  const [positionDetails, setPositionDetails] = useState<string>('');
  const [shouldAdjustCv, setShouldAdjustCv] = useState(false);
  const [positionIntersection, setPositionIntersection] = useState<JobCvIntersectionResponse | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

  // Motivational letter state
  const [motivationalLetter, setMotivationalLetter] = useState<MotivationalLetterResponse | null>(null);
  const [editableMotivationalLetter, setEditableMotivationalLetter] = useState<MotivationalLetterResponse | null>(null);

  // Operation status
  const [currentOperation, setCurrentOperation] = useState<string>('Discussing with AI...');

  // CV status flags
  const [cvAdjusted, setCvAdjusted] = useState(false);
  const [hasManualRefinements, setHasManualRefinements] = useState(false);
  const [hasPreferredProjects, setHasPreferredProjects] = useState(false);

  // Cache status
  const [cacheStatusNotification, setCacheStatusNotification] = useState<{
    show: boolean;
    fromCache: boolean;
  } | null>(null);
  const [lastCacheStatus, setLastCacheStatus] = useState<boolean | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [clearingCache, setClearingCache] = useState(false);

  // UI state
  const [fontSize, setFontSize] = useState(12);

  // Manual adjustment state
  const [isManualAdjustmentMinimized, setIsManualAdjustmentMinimized] = useState(false);
  const [manualOtherChanges, setManualOtherChanges] = useState("");
  const [localManualChanges, setLocalManualChanges] = useState("");

  return {
    // Core CV state
    originalCv,
    setOriginalCv,
    showDiff,
    setShowDiff,
    loading,
    setLoading,

    // Language
    selectedLanguage,
    setLanguage,

    // Notifications
    snackbarMessage,
    setSnackbarMessage,

    // Authentication
    titleClickedTimes,
    setTitleClickedTimes,
    loggingOut,
    setLoggingOut,

    // Position and job
    positionSummary,
    setPositionSummary,
    positionDetails,
    setPositionDetails,
    shouldAdjustCv,
    setShouldAdjustCv,
    positionIntersection,
    setPositionIntersection,
    companyName,
    setCompanyName,

    // Motivational letter
    motivationalLetter,
    setMotivationalLetter,
    editableMotivationalLetter,
    setEditableMotivationalLetter,

    // Operations
    currentOperation,
    setCurrentOperation,

    // Status flags
    cvAdjusted,
    setCvAdjusted,
    hasManualRefinements,
    setHasManualRefinements,
    hasPreferredProjects,
    setHasPreferredProjects,

    // Cache
    cacheStatusNotification,
    setCacheStatusNotification,
    lastCacheStatus,
    setLastCacheStatus,
    cacheStats,
    setCacheStats,
    clearingCache,
    setClearingCache,

    // UI
    fontSize,
    setFontSize,

    // Manual adjustments
    isManualAdjustmentMinimized,
    setIsManualAdjustmentMinimized,
    manualOtherChanges,
    setManualOtherChanges,
    localManualChanges,
    setLocalManualChanges,
  };
}