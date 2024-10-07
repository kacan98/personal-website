import { CvTranslateParams } from '@/app/api/translate-cv/route'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { ChatCompletionStream } from 'openai/lib/ChatCompletionStream.mjs'

export const translateCv = ({
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
  ;(async () => {
    try {
      const res = await fetch('/api/translate-cv', {
        method: 'POST',
        body: JSON.stringify(cvTranslateParams),
      })
      const runner = ChatCompletionStream.fromReadableStream(res.body!)

      runner.on('finalChatCompletion', async (completion) => {
        try {
          if (completion.choices[0].message.content) {
            // setTranslatedCv(JSON.parse(completion.choices[0].message.content))
            console.log(JSON.parse(completion.choices[0].message.content))
            updateCvInRedux(JSON.parse(completion.choices[0].message.content))
          } else {
            // setTranslatedCv(null)
          }
        } catch (e) {
          setsnackbarMessage('Error translating CV: ' + e)
        }
        setLoading(false)
      })
    } catch (err: any) {
      setLoading(false)
      setsnackbarMessage('Error translating CV: ' + err.message)
    }
  })()
}
