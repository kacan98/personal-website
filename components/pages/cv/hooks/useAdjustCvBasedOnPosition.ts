import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model'
import { CvUpgradeParams, CvUpgradeResponse, personalizeCvAPIEndpointName } from '@/app/api/personalize-cv/model'
import {
} from '@/app/api/personalize-cv/route'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
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
}: AdjustCvBasedOnPositionProps) => {
  const adjustCvBasedOnPosition = useCallback(async () => {
    if (!positionDetails) {
      throw new Error('Please provide position details');
    }

    setLoading(true)

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
      })

      const transformedCv: CvUpgradeResponse = await res.json()
      const { cv, newPositionSummary, companyName, newJobIntersection } = transformedCv
      if (cv) updateCvInRedux(cv)
      if (!positionSummary && newPositionSummary) {
        setPositionSummary(newPositionSummary)
      }
      if (!positionIntersection && newJobIntersection) {
        setPositionIntersection(newJobIntersection)
      }

      if (companyName) setCompanyName(companyName)
      setsnackbarMessage('CV transformed')
    } catch (err: any) {
      setsnackbarMessage('Error transforming CV: ' + err.message)
    }

    setLoading(false)
  }, [
    setLoading,
    setsnackbarMessage,
    updateCvInRedux,
    setPositionSummary,
    setCompanyName,
  ])

  return { adjustCvBasedOnPosition }
}
