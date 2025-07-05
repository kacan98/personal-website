import { MotivationalLetterParams, MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'

interface UseMotivationalLetterProps {
  setsnackbarMessage: (message: string) => void
  setMotivationalLetter: (motivationalLetter: MotivationalLetterResponse) => void
  reduxCvProps: CVSettings
}

export const useGetMotivationalLetter = ({
  setsnackbarMessage,
  reduxCvProps,
  setMotivationalLetter,
}: UseMotivationalLetterProps) => {
  const getMotivationalLetter = async (
    positionDetails: string,
    checked: string[],
    selectedLanguage: string
  ) => {
    if (!positionDetails){
      throw new Error('Please provide position details')
    }

    try {
      const params: MotivationalLetterParams = {
        candidate: {
          ...reduxCvProps,
          on: reduxCvProps.on ?? true // Ensure on field is set
        },
        jobDescription: positionDetails,
        strongPoints: checked,
        language: selectedLanguage,
      }

      const res = await fetch('/api/motivational-letter', {
        method: 'POST',
        body: JSON.stringify(params),
      })

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${res.status} - ${errorText}`);
      }

      const body = await res.json()
      setMotivationalLetter(body)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setsnackbarMessage(`Error getting a motivational letter: ${errorMessage}`)
      throw error; // Re-throw to be caught by the parallel execution
    }
  }
  return { getMotivationalLetter }
}
