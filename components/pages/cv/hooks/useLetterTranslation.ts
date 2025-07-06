import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model'
import { LetterTranslateParams } from '@/app/api/translate/letter/route'
import { useCallback } from 'react'

interface UseLetterTranslationProps {
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  setMotivationalLetter: (letter: MotivationalLetterResponse) => void
}

export const useLetterTranslation = ({
  setLoading,
  setsnackbarMessage,
  setMotivationalLetter,
}: UseLetterTranslationProps) => {
  const translateLetter = useCallback(
    async ({
      letter,
      selectedLanguage,
    }: {
      letter: MotivationalLetterResponse
      selectedLanguage: string
    }) => {
      if (selectedLanguage === 'English')
        return setsnackbarMessage('Please select a language to translate to')
      setLoading(true)
      try {
        const res = await fetch('/api/translate/letter', {
          method: 'POST',
          body: JSON.stringify({
            targetLanguage: selectedLanguage,
            letter: letter,
          } as LetterTranslateParams),
        })
        const result = await res.json()
        setMotivationalLetter(result)
        setsnackbarMessage(`Motivational letter translated to ${selectedLanguage}`)
      } catch {
        setsnackbarMessage('Error translating motivational letter')
      }
      setLoading(false)
    },
    [setLoading, setsnackbarMessage, setMotivationalLetter]
  )

  // Version that doesn't manage loading state for batch operations
  const translateLetterWithoutLoading = useCallback(
    async ({
      letter,
      selectedLanguage,
    }: {
      letter: MotivationalLetterResponse
      selectedLanguage: string
    }) => {
      if (selectedLanguage === 'English')
        throw new Error('Please select a language to translate to')
      
      const res = await fetch('/api/translate/letter', {
        method: 'POST',
        body: JSON.stringify({
          targetLanguage: selectedLanguage,
          letter: letter,
        } as LetterTranslateParams),
      })
      
      if (!res.ok) {
        throw new Error('Failed to translate motivational letter')
      }
      
      const result = await res.json()
      setMotivationalLetter(result)
      return result
    },
    [setMotivationalLetter]
  )

  return { translateLetter, translateLetterWithoutLoading }
}
