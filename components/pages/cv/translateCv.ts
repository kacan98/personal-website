import { CvTranslateParams } from '@/app/api/translate-cv/route'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'

export const translateCv = async ({
  cvProps,
  selectedLanguage,
  extraGptInput,
  setLoading,
  setsnackbarMessage,
  updateCvInRedux,
}: {
  cvProps: CVSettings
  selectedLanguage: string
  extraGptInput: string
  setLanguage: (language: string) => void
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string | null) => void
  updateCvInRedux: (cvSettings: CVSettings) => void
}) => {
  setsnackbarMessage(null)

  const cvTranslateParams: CvTranslateParams = {
    cvBody: cvProps,
    targetLanguage: selectedLanguage,
    extraGptInput: extraGptInput,
  }

  setLoading(true)
  try {
    const res = await fetch('/api/translate-cv', {
      method: 'POST',
      body: JSON.stringify(cvTranslateParams),
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
