import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model'
import { CvUpgradeParams, CvUpgradeResponse, personalizeCvAPIEndpointName } from '@/app/api/personalize-cv/model'
import { BulletPoint, CVSettings, CvSection, CvSubSection, Paragraph } from '@/types'
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

function preserveParagraphIds(currentParagraphs?: Paragraph[] | null, originalParagraphs?: Paragraph[] | null) {
  currentParagraphs?.forEach((paragraph, index) => {
    if (originalParagraphs?.[index] && !paragraph.id) {
      paragraph.id = originalParagraphs[index].id;
    }
  });
}

function preserveBulletPointIds(currentBulletPoints?: BulletPoint[] | null, originalBulletPoints?: BulletPoint[] | null) {
  currentBulletPoints?.forEach((bullet, index) => {
    if (originalBulletPoints?.[index] && !bullet.id) {
      bullet.id = originalBulletPoints[index].id;
    }
  });
}

function preserveSubSectionIds(currentSubSections?: CvSubSection[] | null, originalSubSections?: CvSubSection[] | null) {
  currentSubSections?.forEach((subSection, index) => {
    const originalSubSection = originalSubSections?.[index];

    if (originalSubSection && !subSection.id) {
      subSection.id = originalSubSection.id;
    }

    preserveParagraphIds(subSection.paragraphs, originalSubSection?.paragraphs);
    preserveBulletPointIds(subSection.bulletPoints, originalSubSection?.bulletPoints);
  });
}

function preserveSectionIds(currentSections: CvSection[] | null | undefined, originalSections: CvSection[] | null | undefined) {
  currentSections?.forEach((section, index) => {
    const originalSection = originalSections?.[index];

    if (originalSection && !section.id) {
      section.id = originalSection.id;
    }

    preserveParagraphIds(section.paragraphs, originalSection?.paragraphs);
    preserveBulletPointIds(section.bulletPoints, originalSection?.bulletPoints);
    preserveSubSectionIds(section.subSections, originalSection?.subSections);
  });
}

function preserveCvIdsFromOriginal(currentCv: CVSettings, originalCv: CVSettings) {
  preserveSectionIds(currentCv.mainColumn, originalCv.mainColumn);
  preserveSectionIds(currentCv.sideColumn, originalCv.sideColumn);
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
  const adjustCvBasedOnPosition = useCallback(async (positionOverride?: string) => {
    const effectivePositionDetails = positionOverride ?? positionDetails;

    if (!effectivePositionDetails) {
      throw new Error('Please provide position details');
    }

    setLoading(true);

    const cvUpgradeParams: CvUpgradeParams = {
      cvBody: cvProps,
      positionWeAreApplyingFor: effectivePositionDetails,
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

      if (setCacheStatus && _cacheInfo) {
        setCacheStatus(_cacheInfo.fromCache)
      }

      if (cv) {
        preserveCvIdsFromOriginal(cv, cvProps)
        updateCvInRedux(cv)
      }
      if (!positionSummary && newPositionSummary) {
        setPositionSummary(newPositionSummary)
      }
      if (!positionIntersection && newJobIntersection) {
        setPositionIntersection(newJobIntersection)
      }

      if (companyName) setCompanyName(companyName)
      return transformedCv
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setsnackbarMessage('Error transforming CV: ' + errorMessage)
      throw err;
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
