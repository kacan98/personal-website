import { useEffect, useRef } from 'react';
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
  // Store the original title when component mounts
  const originalTitle = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Capture the original title on first mount
    if (originalTitle.current === undefined) {
      originalTitle.current = document.title;
    }

    // Find the active step
    const activeStep = (Object.keys(progressSteps) as Array<keyof ProgressSteps>).find(
      step => progressSteps[step] === 'active'
    );

    // Only update title if there's something meaningful to show
    if (isLoading && activeStep) {
      // Show loading progress
      document.title = stepTitles[activeStep];
    } else if (companyName) {
      // Show company name
      document.title = `${baseTitle} - ${companyName}`;
    }
    // Otherwise, don't change the title - leave it as the default from Next.js

    // Cleanup: restore the original title when component unmounts
    return () => {
      if (originalTitle.current !== undefined) {
        document.title = originalTitle.current;
      }
    };
  }, [isLoading, progressSteps, companyName, baseTitle]);
};
