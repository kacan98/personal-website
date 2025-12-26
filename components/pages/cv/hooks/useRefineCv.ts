import { useState, useCallback } from 'react';
import { CVSettings } from '@/types';
import { RefineCvRequest, RefineCvResponseData, refineCvAPIEndpointName } from '@/app/api/refine-cv/model';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateCvWithChanges } from '@/redux/slices/cv';

interface UseRefineCvProps {
  originalCv: CVSettings;
  currentCv: CVSettings;
  positionDetails?: string;
  setsnackbarMessage: (message: string) => void;
  setLoading: (loading: boolean) => void;
  setCurrentOperation: (operation: string) => void;
}

interface RefinementData {
  checkedImprovements: string[];
  improvementInputs: { [key: string]: string };
  missingSkills: string;
  otherChanges: string;
}

export const useRefineCv = ({
  originalCv,
  currentCv,
  positionDetails,
  setsnackbarMessage,
  setLoading,
  setCurrentOperation,
}: UseRefineCvProps) => {
  const dispatch = useAppDispatch();
  const includeOriginalCv = useAppSelector(state => state.ui?.includeOriginalCv ?? false);
  const includePositionDetails = useAppSelector(state => state.ui?.includePositionDetails ?? false);
  const [refinementHistory, setRefinementHistory] = useState<string[]>([]);

  const refineCv = useCallback(async (refinementData: RefinementData) => {
    try {
      setLoading(true);
      setCurrentOperation('Refining your CV based on your feedback...');

      const requestBody: RefineCvRequest = {
        // Only include originalCv if Redux state says to include it
        originalCv: includeOriginalCv === true ? originalCv : undefined,
        currentCv,
        checkedImprovements: refinementData.checkedImprovements.length > 0 ? refinementData.checkedImprovements : undefined,
        improvementInputs: Object.keys(refinementData.improvementInputs).length > 0 ? refinementData.improvementInputs : undefined,
        missingSkills: refinementData.missingSkills.trim() || undefined,
        otherChanges: refinementData.otherChanges.trim() || undefined,
        // Only include position details if user has checked the option
        positionContext: includePositionDetails && positionDetails ? positionDetails : undefined,
      };

      console.log('Refining CV with data (includeOriginalCv:', includeOriginalCv, ', includePositionDetails:', includePositionDetails, '):', requestBody);

      const response = await fetch(refineCvAPIEndpointName, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: RefineCvResponseData = await response.json();

      // Update the CV in Redux while preserving hasChanges flag
      dispatch(updateCvWithChanges(data.cv));

      // Track refinement history
      if (data.refinementSummary) {
        setRefinementHistory(prev => [...prev, data.refinementSummary!]);
      }

      // Show success message
      const changesCount = (refinementData.checkedImprovements.length > 0 ? 1 : 0) +
                          (Object.keys(refinementData.improvementInputs).length > 0 ? 1 : 0) +
                          (refinementData.missingSkills.trim() ? 1 : 0) +
                          (refinementData.otherChanges.trim() ? 1 : 0);

      setsnackbarMessage(`CV successfully refined with ${changesCount} type${changesCount !== 1 ? 's' : ''} of improvements!`);

      console.log('CV refinement completed successfully');
    } catch (error) {
      console.error('Error refining CV:', error);
      setsnackbarMessage(
        error instanceof Error
          ? `Failed to refine CV: ${error.message}`
          : 'Failed to refine CV. Please try again.'
      );
    } finally {
      setLoading(false);
      setCurrentOperation('Discussing with AI...');
    }
  }, [originalCv, currentCv, positionDetails, includeOriginalCv, includePositionDetails, dispatch, setLoading, setsnackbarMessage, setCurrentOperation]);

  return {
    refineCv,
    refinementHistory,
  };
};