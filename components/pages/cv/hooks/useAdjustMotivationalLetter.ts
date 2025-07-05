import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'

export const useAdjustMotivationalLetter = ({
  setMotivationalLetter,
}: {
  setMotivationalLetter: (motivationalLetter: MotivationalLetterResponse) => void
}) => {

  const adjustMotivationalLetter = async (
    currentLetter: MotivationalLetterResponse,
    adjustmentComments: string,
    jobDescription: string,
    candidate: CVSettings,
    language: string = 'English'
  ) => {
    try {
      const response = await fetch('/api/motivational-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentLetter,
          adjustmentComments,
          jobDescription,
          candidate,
          language,
          strongPoints: [], // Not needed for adjustments
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to adjust motivational letter')
      }

      const adjustedLetter: MotivationalLetterResponse = await response.json()
      setMotivationalLetter(adjustedLetter)

      return adjustedLetter
    } catch (error) {
      throw error
    }
  }

  return {
    adjustMotivationalLetter,
  }
}
