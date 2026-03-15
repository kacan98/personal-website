import { useCallback } from 'react'
import { CVSettings } from '@/types'
import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model'

interface UseFreeformLetterAdjustmentProps {
  setMotivationalLetter: (letter: MotivationalLetterResponse) => void
  positionDetails?: string
  candidate?: CVSettings
  strongPoints?: string[]
}

export const useFreeformLetterAdjustment = ({
  setMotivationalLetter,
  positionDetails,
  candidate,
  strongPoints,
}: UseFreeformLetterAdjustmentProps) => {

  const adjustLetterFreeform = useCallback(async (
    currentLetter: string,
    userRequest: string
  ) => {
    try {
      const response = await fetch('/api/motivational-letter/freeform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentLetter,
          userRequest,
          positionDetails,
          candidate,
          strongPoints,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to adjust motivational letter')
      }

      const result = await response.json()

      // Convert the freeform letter back to a structure that the modal can display
      // Since it's now freeform, we'll put it all in the opening field
      const freeformLetter: MotivationalLetterResponse = {
        letter: result.letter,
      }

      setMotivationalLetter(freeformLetter)

      return freeformLetter
    } catch (error) {
      throw error
    }
  }, [setMotivationalLetter, positionDetails, candidate, strongPoints])

  return {
    adjustLetterFreeform,
  }
}
