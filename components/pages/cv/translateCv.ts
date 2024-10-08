import { CvUpgradeParams } from '@/app/api/upgrade-cv/route'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'

export const upgradeCv = async ({
  cvProps,
  setLoading,
  setsnackbarMessage,
  updateCvInRedux,
  positionDetails,
  positionSummary,
}: {
  cvProps: CVSettings
  positionDetails: string | null
  positionSummary: string | null
  setLanguage: (language: string) => void
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string | null) => void
  updateCvInRedux: (cvSettings: CVSettings) => void
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
    if (transformedCv) {
      // setTranslatedCv(JSON.parse(completion.choices[0].message.content))
      updateCvInRedux(JSON.parse(transformedCv))
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
