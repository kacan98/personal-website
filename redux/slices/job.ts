import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model';

interface JobState {
  // Core job data
  positionDetails: string;
  positionSummary: string;
  companyName: string | null;

  // Job analysis
  positionIntersection: JobCvIntersectionResponse | null;
  checked: string[]; // Selected improvements/skills

  // Job loading state
  isLoadingJobFromUrl: boolean;
  jobLoadingTimeout: boolean;
}

const initialState: JobState = {
  positionDetails: '',
  positionSummary: '',
  companyName: null,
  positionIntersection: null,
  checked: [],
  isLoadingJobFromUrl: false,
  jobLoadingTimeout: false,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setPositionDetails: (state, action: PayloadAction<string>) => {
      state.positionDetails = action.payload;
    },
    setPositionSummary: (state, action: PayloadAction<string>) => {
      state.positionSummary = action.payload;
    },
    setCompanyName: (state, action: PayloadAction<string | null>) => {
      state.companyName = action.payload;
    },
    setPositionIntersection: (state, action: PayloadAction<JobCvIntersectionResponse | null>) => {
      state.positionIntersection = action.payload;
    },
    setChecked: (state, action: PayloadAction<string[]>) => {
      state.checked = action.payload;
    },
    toggleChecked: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      const currentIndex = state.checked.indexOf(item);
      if (currentIndex === -1) {
        state.checked.push(item);
      } else {
        state.checked.splice(currentIndex, 1);
      }
    },
    setIsLoadingJobFromUrl: (state, action: PayloadAction<boolean>) => {
      state.isLoadingJobFromUrl = action.payload;
    },
    setJobLoadingTimeout: (state, action: PayloadAction<boolean>) => {
      state.jobLoadingTimeout = action.payload;
    },
    resetJobState: () => initialState,
  },
});

export const {
  setPositionDetails,
  setPositionSummary,
  setCompanyName,
  setPositionIntersection,
  setChecked,
  toggleChecked,
  setIsLoadingJobFromUrl,
  setJobLoadingTimeout,
  resetJobState,
} = jobSlice.actions;

export default jobSlice.reducer;