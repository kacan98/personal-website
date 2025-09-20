import { useCallback } from 'react'

interface UseFreeformLetterAdjustmentProps {
  setMotivationalLetter: (letter: any) => void
  positionDetails?: string
}

export const useFreeformLetterAdjustment = ({
  setMotivationalLetter,
  positionDetails,
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
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to adjust motivational letter')
      }

      const result = await response.json()

      // Convert the freeform letter back to a structure that the modal can display
      // Since it's now freeform, we'll put it all in the opening field
      const freeformLetter = {
        greeting: '',
        opening: result.letter,
        whyThisRole: '',
        keyStrengths: [],
        uniqueValue: '',
        closing: '',
        signature: ''
      }

      setMotivationalLetter(freeformLetter)

      return freeformLetter
    } catch (error) {
      throw error
    }
  }, [setMotivationalLetter, positionDetails])

  return {
    adjustLetterFreeform,
  }
}