import { useState, useCallback } from 'react';
import { ProgressSteps, StepStatus, UseStepProgressProps } from '@/types/adjustment';

const initialProgressSteps: ProgressSteps = {
  analyzing: 'pending',
  ranking: 'pending',
  personalizingCV: 'pending',
  generatingLetter: 'pending'
};

export const useStepProgress = ({
  initialSteps = {},
  onStepChange
}: UseStepProgressProps = {}) => {
  const [progressSteps, setProgressSteps] = useState<ProgressSteps>({
    ...initialProgressSteps,
    ...initialSteps
  });

  const updateStep = useCallback((step: keyof ProgressSteps, status: StepStatus) => {
    setProgressSteps(prev => ({
      ...prev,
      [step]: status
    }));
    onStepChange?.(step, status);
  }, [onStepChange]);

  const setStepActive = useCallback((step: keyof ProgressSteps) => {
    updateStep(step, 'active');
  }, [updateStep]);

  const setStepCompleted = useCallback((step: keyof ProgressSteps) => {
    updateStep(step, 'completed');
  }, [updateStep]);

  const resetAllSteps = useCallback(() => {
    setProgressSteps(initialProgressSteps);
  }, []);

  const resetToStep = useCallback((step: keyof ProgressSteps) => {
    const stepOrder: (keyof ProgressSteps)[] = ['analyzing', 'ranking', 'personalizingCV', 'generatingLetter'];
    const resetFromIndex = stepOrder.indexOf(step);

    setProgressSteps(prev => {
      const updated = { ...prev };
      stepOrder.slice(resetFromIndex).forEach(stepKey => {
        updated[stepKey] = 'pending';
      });
      return updated;
    });
  }, []);

  const isStepActive = useCallback((step: keyof ProgressSteps) => {
    return progressSteps[step] === 'active';
  }, [progressSteps]);

  const isStepCompleted = useCallback((step: keyof ProgressSteps) => {
    return progressSteps[step] === 'completed';
  }, [progressSteps]);

  const isStepPending = useCallback((step: keyof ProgressSteps) => {
    return progressSteps[step] === 'pending';
  }, [progressSteps]);

  const areAllStepsCompleted = useCallback(() => {
    return Object.values(progressSteps).every(status => status === 'completed');
  }, [progressSteps]);

  const getActiveStep = useCallback(() => {
    const stepOrder: (keyof ProgressSteps)[] = ['analyzing', 'ranking', 'personalizingCV', 'generatingLetter'];
    return stepOrder.find(step => progressSteps[step] === 'active') || null;
  }, [progressSteps]);

  return {
    progressSteps,
    updateStep,
    setStepActive,
    setStepCompleted,
    resetAllSteps,
    resetToStep,
    isStepActive,
    isStepCompleted,
    isStepPending,
    areAllStepsCompleted,
    getActiveStep
  };
};