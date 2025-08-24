import { CvTranslateParams } from '@/app/api/translate/cv/route'
import { CVSettings } from '@/types'
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
        const res = await fetch('/api/translate/cv', {
          method: 'POST',
          body: JSON.stringify({
            targetLanguage: selectedLanguage,
            cv: cvProps,
          } as CvTranslateParams),
        })
        const result = await res.json()
        updateCvInRedux(JSON.parse(result))
        setsnackbarMessage(`CV translated to ${selectedLanguage}`)
      } catch {
        setsnackbarMessage('Error translating CV')
      }
      setLoading(false)
    },
    [setLoading, setsnackbarMessage, updateCvInRedux]
  )

  // Version that doesn't manage loading state for batch operations
  const translateCvWithoutLoading = useCallback(
    async ({
      cvProps,
      selectedLanguage,
    }: {
      cvProps: CVSettings
      selectedLanguage: string
    }) => {
      if (selectedLanguage === 'English')
        throw new Error('Please select a language to translate to')

      const res = await fetch('/api/translate/cv', {
        method: 'POST',
        body: JSON.stringify({
          targetLanguage: selectedLanguage,
          cv: cvProps,
        } as CvTranslateParams),
      })

      if (!res.ok) {
        throw new Error('Failed to translate CV')
      }

      const result = await res.json()
      const translatedCv = JSON.parse(result)
      updateCvInRedux(translatedCv)
      return translatedCv
    },
    [updateCvInRedux]
  )

  return { translateCv, translateCvWithoutLoading }
}
