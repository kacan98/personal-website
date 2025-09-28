import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model'
import { CvUpgradeParams, CvUpgradeResponse, personalizeCvAPIEndpointName } from '@/app/api/personalize-cv/model'
import { CVSettings } from '@/types'
import { useCallback } from 'react'

interface AdjustCvBasedOnPositionProps {
  cvProps: CVSettings
  positionDetails: string | null
  positionSummary?: string | null
  positionIntersection?: JobCvIntersectionResponse | null

  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  updateCvInRedux: (cvSettings: CVSettings) => void
  updateSummary: () => void
  setPositionSummary: (positionSummary: string) => void
  setCompanyName: (companyName: string) => void
  setPositionIntersection: (intersection: JobCvIntersectionResponse) => void
  setCacheStatus?: (fromCache: boolean) => void
}

export const useAdjustCvBasedOnPosition = ({
  cvProps,
  positionDetails,
  positionSummary,
  positionIntersection,
  setLoading,
  setsnackbarMessage,
  updateCvInRedux,
  setPositionSummary,
  setCompanyName,
  setPositionIntersection,
  setCacheStatus,
}: AdjustCvBasedOnPositionProps) => {
  const adjustCvBasedOnPosition = useCallback(async () => {    
    if (!positionDetails) {
      throw new Error('Please provide position details');
    }

    setLoading(true);

    const cvUpgradeParams: CvUpgradeParams = {
      cvBody: cvProps,
      positionWeAreApplyingFor: positionDetails,
      positionIntersection: positionIntersection ?? undefined,
      positionSummary: positionSummary ?? undefined,
    }

    try {
      const res = await fetch(personalizeCvAPIEndpointName, {
        method: 'POST',
        body: JSON.stringify(cvUpgradeParams),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${res.status} - ${errorText}`);
      }

      const transformedCv: CvUpgradeResponse = await res.json()
      const { cv, newPositionSummary, companyName, newJobIntersection, _cacheInfo } = transformedCv

      // Update cache status if callback provided
      if (setCacheStatus && _cacheInfo) {
        setCacheStatus(_cacheInfo.fromCache)
      }

      // Preserve original IDs to maintain diff tracking
      if (cv) {
        // Preserve main column section IDs
        cv.mainColumn?.forEach((section, index) => {
          if (cvProps.mainColumn?.[index]) {
            section.id = cvProps.mainColumn[index].id;

            // Preserve subsection IDs
            if (section.subSections && cvProps.mainColumn[index].subSections) {
              section.subSections.forEach((subSection, subIndex) => {
                if (cvProps.mainColumn[index].subSections?.[subIndex]) {
                  subSection.id = cvProps.mainColumn[index].subSections[subIndex].id;
                }
              });
            }

            // Preserve bullet point IDs
            if (section.bulletPoints && cvProps.mainColumn[index].bulletPoints) {
              section.bulletPoints.forEach((bullet, bulletIndex) => {
                if (cvProps.mainColumn[index].bulletPoints?.[bulletIndex]) {
                  bullet.id = cvProps.mainColumn[index].bulletPoints[bulletIndex].id;
                }
              });
            }
          }
        });

        // Preserve side column section IDs
        cv.sideColumn?.forEach((section, index) => {
          if (cvProps.sideColumn?.[index]) {
            section.id = cvProps.sideColumn[index].id;

            // Preserve bullet point IDs
            if (section.bulletPoints && cvProps.sideColumn[index].bulletPoints) {
              section.bulletPoints.forEach((bullet, bulletIndex) => {
                if (cvProps.sideColumn[index].bulletPoints?.[bulletIndex]) {
                  bullet.id = cvProps.sideColumn[index].bulletPoints[bulletIndex].id;
                }
              });
            }
          }
        });

        updateCvInRedux(cv)
      }
      if (!positionSummary && newPositionSummary) {
        setPositionSummary(newPositionSummary)
      }
      if (!positionIntersection && newJobIntersection) {
        setPositionIntersection(newJobIntersection)
      }

      if (companyName) setCompanyName(companyName)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setsnackbarMessage('Error transforming CV: ' + errorMessage)
      throw err; // Re-throw to be caught by the parallel execution
    } finally {
      setLoading(false);
    }
  }, [
    cvProps,
    positionDetails,
    positionSummary,
    positionIntersection,
    setLoading,
    setsnackbarMessage,
    updateCvInRedux,
    setPositionSummary,
    setCompanyName,
    setPositionIntersection,
    setCacheStatus,
  ])

  return { adjustCvBasedOnPosition }
}
