import { CvTranslateParams } from '@/app/api/translate/route'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { useCallback } from 'react'

interface UseCvTranslationProps {
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  updateCvInRedux: (cvSettings: CVSettings) => void
}

export const useCvTranslation = ({
  setLoading,
  setsnackbarMessage,
  updateCvInRedux,
}: UseCvTranslationProps) => {
  const translateCv = useCallback(
    async ({
      cvProps,
      selectedLanguage,
    }: {
      cvProps: CVSettings
      selectedLanguage: string
    }) => {
      if (selectedLanguage === 'English')
        return setsnackbarMessage('Please select a language to translate to')
      setLoading(true)
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          body: JSON.stringify({
            targetLanguage: selectedLanguage,
            cv: cvProps,
          } as CvTranslateParams),
        })
        const result = await res.json()
        updateCvInRedux(JSON.parse(result))
      } catch {
        setsnackbarMessage('Error getting a judgement')
      }
      setLoading(false)
    },
    [setLoading, setsnackbarMessage, updateCvInRedux]
  )

  return { translateCv }
}
