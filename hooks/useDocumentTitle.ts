import { useEffect } from 'react';
import { ProgressSteps } from '@/types/adjustment';

interface UseDocumentTitleProps {
  isLoading: boolean;
  progressSteps: ProgressSteps;
  companyName: string | null;
  baseTitle?: string;
}

const stepTitles: Record<keyof ProgressSteps, string> = {
  analyzing: '🔍 Analyzing Position...',
  ranking: '📊 Ranking Stories...',
  personalizingCV: '✨ Personalizing CV...',
  generatingLetter: '✍️ Generating Letter...'
};

export const useDocumentTitle = ({
  isLoading,
  progressSteps,
  companyName,
  baseTitle = 'CV'
}: UseDocumentTitleProps) => {
  useEffect(() => {
    // Find the active step
    const activeStep = (Object.keys(progressSteps) as Array<keyof ProgressSteps>).find(
      step => progressSteps[step] === 'active'
    );

    // Update title based on state
    if (isLoading && activeStep) {
      document.title = stepTitles[activeStep];
    } else if (companyName) {
      document.title = `${baseTitle} - ${companyName}`;
    } else {
      document.title = baseTitle;
    }

    // Cleanup: reset to base title when component unmounts
    return () => {
      document.title = baseTitle;
    };
  }, [isLoading, progressSteps, companyName, baseTitle]);
};
