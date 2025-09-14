import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  // Loading states
  loading: boolean;
  currentOperation: string;

  // Modal states
  jobDescriptionModalOpen: boolean;
  manualAdjustmentModalOpen: boolean;
  motivationalLetterModalOpen: boolean;
  translationModalOpen: boolean;
  positionAnalysisModalOpen: boolean;
  isManualAdjustmentMinimized: boolean;

  // Notifications
  snackbarMessage: string | null;

  // CV settings
  fontSize: number;
  selectedLanguage: string;
  showDiff: boolean;
  titleClickedTimes: number;

  // Manual adjustment input
  manualOtherChanges: string;
}

const initialState: UiState = {
  loading: false,
  currentOperation: 'Discussing with AI...',

  jobDescriptionModalOpen: false,
  manualAdjustmentModalOpen: false,
  motivationalLetterModalOpen: false,
  translationModalOpen: false,
  positionAnalysisModalOpen: false,
  isManualAdjustmentMinimized: false,

  snackbarMessage: null,

  fontSize: 12,
  selectedLanguage: 'English',
  showDiff: false,
  titleClickedTimes: 0,

  manualOtherChanges: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrentOperation: (state, action: PayloadAction<string>) => {
      state.currentOperation = action.payload;
    },

    // Modal actions
    setJobDescriptionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.jobDescriptionModalOpen = action.payload;
    },
    setManualAdjustmentModalOpen: (state, action: PayloadAction<boolean>) => {
      state.manualAdjustmentModalOpen = action.payload;
    },
    setMotivationalLetterModalOpen: (state, action: PayloadAction<boolean>) => {
      state.motivationalLetterModalOpen = action.payload;
    },
    setTranslationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.translationModalOpen = action.payload;
    },
    setPositionAnalysisModalOpen: (state, action: PayloadAction<boolean>) => {
      state.positionAnalysisModalOpen = action.payload;
    },
    setIsManualAdjustmentMinimized: (state, action: PayloadAction<boolean>) => {
      state.isManualAdjustmentMinimized = action.payload;
    },
    closeAllModals: (state) => {
      state.jobDescriptionModalOpen = false;
      state.manualAdjustmentModalOpen = false;
      state.motivationalLetterModalOpen = false;
      state.translationModalOpen = false;
      state.positionAnalysisModalOpen = false;
      state.isManualAdjustmentMinimized = false;
    },

    // Notification actions
    setSnackbarMessage: (state, action: PayloadAction<string | null>) => {
      state.snackbarMessage = action.payload;
    },
    clearSnackbarMessage: (state) => {
      state.snackbarMessage = null;
    },

    // CV settings actions
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },
    setSelectedLanguage: (state, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload;
    },
    setShowDiff: (state, action: PayloadAction<boolean>) => {
      state.showDiff = action.payload;
    },
    toggleShowDiff: (state) => {
      state.showDiff = !state.showDiff;
    },
    incrementTitleClickedTimes: (state) => {
      state.titleClickedTimes += 1;
    },
    resetTitleClickedTimes: (state) => {
      state.titleClickedTimes = 0;
    },

    // Manual adjustment actions
    setManualOtherChanges: (state, action: PayloadAction<string>) => {
      state.manualOtherChanges = action.payload;
    },
    clearManualOtherChanges: (state) => {
      state.manualOtherChanges = '';
    },

    // Reset all UI state
    resetUiState: () => initialState,
  },
});

export const {
  setLoading,
  setCurrentOperation,
  setJobDescriptionModalOpen,
  setManualAdjustmentModalOpen,
  setMotivationalLetterModalOpen,
  setTranslationModalOpen,
  setPositionAnalysisModalOpen,
  setIsManualAdjustmentMinimized,
  closeAllModals,
  setSnackbarMessage,
  clearSnackbarMessage,
  setFontSize,
  setSelectedLanguage,
  setShowDiff,
  toggleShowDiff,
  incrementTitleClickedTimes,
  resetTitleClickedTimes,
  setManualOtherChanges,
  clearManualOtherChanges,
  resetUiState,
} = uiSlice.actions;

export default uiSlice.reducer;