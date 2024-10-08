import { CvUpgradeParams, CvUpgradeResponse } from '@/app/api/upgrade-cv/route'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'

export const upgradeCv = async ({
  cvProps,
  setLoading,
  setsnackbarMessage,
  updateCvInRedux,
  positionDetails,
  positionSummary,
  setPositionSummary,
}: {
  cvProps: CVSettings
  positionDetails: string | null
  positionSummary: string | null
  setLanguage: (language: string) => void
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string | null) => void
  updateCvInRedux: (cvSettings: CVSettings) => void
  setPositionSummary: (positionSummary: string) => void
}) => {
  setsnackbarMessage(null)

  const cvUpgradeParams: CvUpgradeParams = {
    cvBody: cvProps,
    positionWeAreApplyingFor: positionDetails ?? undefined,
    positionSummary: positionSummary ?? undefined,
  }

  setLoading(true)
  try {
    const res = await fetch('/api/upgrade-cv', {
      method: 'POST',
      body: JSON.stringify(cvUpgradeParams),
    })

    const transformedCv: string = await res.json()
    const parsedResponse: CvUpgradeResponse = JSON.parse(transformedCv)
    if (transformedCv) {
      updateCvInRedux(parsedResponse.cv)
      if (!positionSummary && parsedResponse.newPositionSummary) {
        // if positionSummary is not provided, the endpoint will get it internally
        setPositionSummary(parsedResponse.newPositionSummary)
      }
    } else {
      setsnackbarMessage('Error transforming CV')
    }
    setLoading(false)
    setsnackbarMessage('CV transformed')
  } catch (err: any) {
    setLoading(false)
    setsnackbarMessage('Error transforming CV: ' + err.message)
  }
}
