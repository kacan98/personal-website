import {
  CvUpgradeParams,
  CvUpgradeResponse,
} from '@/app/api/personalize-cv/route'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'

export const adjustCvBasedOnPosition = async ({
  cvProps,
  setLoading,
  setsnackbarMessage,
  updateCvInRedux,
  positionDetails,
  positionSummary,
  setPositionSummary,
  setCompanyName,
}: {
  cvProps: CVSettings
  positionDetails: string | null
  positionSummary: string | null
  setLanguage: (language: string) => void
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string | null) => void
  updateCvInRedux: (cvSettings: CVSettings) => void
  setPositionSummary: (positionSummary: string) => void
  setCompanyName: (companyName: string) => void
}) => {
  setsnackbarMessage(null)

  const cvUpgradeParams: CvUpgradeParams = {
    cvBody: cvProps,
    positionWeAreApplyingFor: positionDetails ?? undefined,
    positionSummary: positionSummary ?? undefined,
  }

  setLoading(true)
  try {
    const res = await fetch('/api/personalize-cv', {
      method: 'POST',
      body: JSON.stringify(cvUpgradeParams),
    })

    const transformedCv: CvUpgradeResponse = await res.json()
    const { cv, newPositionSummary, companyName } = transformedCv
    if (cv) updateCvInRedux(cv)
    if (!positionSummary && newPositionSummary) {
      setPositionSummary(newPositionSummary)
    }
    if (companyName) setCompanyName(companyName)
    setsnackbarMessage('CV transformed')
  } catch (err: any) {
    setsnackbarMessage('Error transforming CV: ' + err.message)
  }

  setLoading(false)
}
