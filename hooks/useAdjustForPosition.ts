import { useState, useCallback } from 'react';
import { useStepProgress } from './useStepProgress';
import {
  AdjustmentWorkflowState,
  UseAdjustForPositionProps,
  RankedStory,
  StoryRankingResponse
} from '@/types/adjustment';

const isE2E = process.env.NEXT_PUBLIC_E2E === 'true';

async function waitForStepDelay(ms: number) {
  if (isE2E || ms <= 0) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, ms));
}

export const useAdjustForPosition = ({
  onCvUpdate,
  onMotivationalLetterUpdate,
  onError,
  adjustCvBasedOnPosition,
  getMotivationalLetter
}: UseAdjustForPositionProps & {
  adjustCvBasedOnPosition?: (positionDetails: string) => Promise<unknown>;
  getMotivationalLetter?: (positionDetails: string, checked: string[], selectedLanguage: string) => Promise<void>;
} = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentOperation, setCurrentOperation] = useState('');
  const [rankedStories, setRankedStories] = useState<RankedStory[] | null>(null);

  const {
    progressSteps,
    setStepActive,
    setStepCompleted,
    resetAllSteps
  } = useStepProgress();

  const resetWorkflow = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setCurrentOperation('');
    setRankedStories(null);
    resetAllSteps();
  }, [resetAllSteps]);

  const rankStories = useCallback(async (positionDetails: string): Promise<RankedStory[]> => {
    setStepActive('analyzing');
    setCurrentOperation('Analyzing position requirements...');

    const response = await fetch('/api/stories/rank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobDescription: positionDetails,
        maxStories: 6
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to rank stories');
    }

    const result: StoryRankingResponse = await response.json();
    setStepCompleted('analyzing');

    await waitForStepDelay(1000);

    setStepActive('ranking');
    setCurrentOperation('Ranking project stories...');

    await waitForStepDelay(1500);

    setRankedStories(result.selectedStories);
    setStepCompleted('ranking');

    return result.selectedStories;
  }, [setStepActive, setStepCompleted]);

  const adjustCv = useCallback(async (positionDetails: string) => {
    setStepActive('personalizingCV');

    if (adjustCvBasedOnPosition) {
      const result = await adjustCvBasedOnPosition(positionDetails);
      setStepCompleted('personalizingCV');
      return result;
    }

    throw new Error('adjustCvBasedOnPosition function not provided');
  }, [adjustCvBasedOnPosition, setStepActive, setStepCompleted]);

  const generateMotivationalLetterWrapper = useCallback(async (
    positionDetails: string,
    checked: string[],
    selectedLanguage: string
  ) => {
    setStepActive('generatingLetter');

    if (getMotivationalLetter) {
      const result = await getMotivationalLetter(positionDetails, checked, selectedLanguage);
      setStepCompleted('generatingLetter');
      return result;
    }

    throw new Error('getMotivationalLetter function not provided');
  }, [getMotivationalLetter, setStepActive, setStepCompleted]);

  const startAdjustment = useCallback(async (
    positionDetails: string,
    checked: string[],
    selectedLanguage: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      resetAllSteps();

      // Step 1: Rank stories first
      const stories = await rankStories(positionDetails);

      // Step 2: Run CV adjustment and motivational letter generation in parallel
      setCurrentOperation('Personalizing CV and generating motivational letter...');

      await Promise.all([
        adjustCv(positionDetails),
        generateMotivationalLetterWrapper(positionDetails, checked, selectedLanguage)
      ]);

      // Update CV with ranked stories
      if (stories.length > 0 && onCvUpdate) {
        onCvUpdate(stories.slice(0, 4)); // Top 4 for CV
      }

      setCurrentOperation('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [
    rankStories,
    adjustCv,
    generateMotivationalLetterWrapper,
    onCvUpdate,
    onMotivationalLetterUpdate,
    onError,
    resetAllSteps
  ]);

  const state: AdjustmentWorkflowState = {
    isLoading,
    error,
    progressSteps,
    rankedStories,
    currentOperation
  };

  return {
    ...state,
    startAdjustment,
    resetWorkflow
  };
};
