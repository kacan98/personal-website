export type StepStatus = 'pending' | 'active' | 'completed';

export interface ProgressSteps {
  analyzing: StepStatus;
  ranking: StepStatus;
  personalizingCV: StepStatus;
  generatingLetter: StepStatus;
}

export interface RankedStory {
  id: string;
  title: string;
  category: string;
  relevance: number;
  tags: string[];
  metrics?: {
    impact?: string;
    timeframe?: string;
    usersAffected?: string;
  };
  url: string;
  fullUrl: string;
  content: string;
}

export interface StoryRankingResponse {
  selectedStories: RankedStory[];
  selectionReasoning: string;
  useStories: boolean;
  totalAvailable: number;
}

export interface AdjustmentWorkflowState {
  isLoading: boolean;
  error: string | null;
  progressSteps: ProgressSteps;
  rankedStories: RankedStory[] | null;
  currentOperation: string;
}

export interface AdjustmentWorkflowActions {
  startAdjustment: (positionDetails: string, checked: boolean, selectedLanguage: string) => Promise<void>;
  resetWorkflow: () => void;
  updateProgress: (step: keyof ProgressSteps, status: StepStatus) => void;
}

export interface UseAdjustForPositionProps {
  onCvUpdate?: (stories: RankedStory[]) => void;
  onMotivationalLetterUpdate?: (letter: string) => void;
  onError?: (error: string) => void;
}

export interface UseStepProgressProps {
  initialSteps?: Partial<ProgressSteps>;
  onStepChange?: (step: keyof ProgressSteps, status: StepStatus) => void;
}