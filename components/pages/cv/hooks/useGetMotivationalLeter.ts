import { MotivationalLetterParams } from '@/app/api/motivational-letter/motivational-letter.model'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'

interface UseMotivationalLetterProps {
  setLoading: (boolean: boolean) => void
  setsnackbarMessage: (message: string) => void
  setMotivationalLetter: (motivationalLetter: string) => void
  reduxCvProps: CVSettings
}

export const useGetMotivationalLetter = ({
  setLoading,
  setsnackbarMessage,
  reduxCvProps,
  setMotivationalLetter,
}: UseMotivationalLetterProps) => {
  const getMotivationalLetter = async (
    positionDetails: string,
    checked: string[],
    selectedLanguage: string
  ) => {
    if (!positionDetails)
      return setsnackbarMessage('Please provide position details')
    setLoading(true)
    try {
      const params: MotivationalLetterParams = {
        candidate: reduxCvProps,
        jobDescription: positionDetails,
        strongPoints: checked,
        language: selectedLanguage,
      }
      const res = await fetch('/api/motivational-letter', {
        method: 'POST',
        body: JSON.stringify(params),
      })
      const body = await res.text()
      setMotivationalLetter(body)
    } catch {
      setsnackbarMessage('Error getting a motivational letter')
    }
    setLoading(false)
  }
  return { getMotivationalLetter }
}
