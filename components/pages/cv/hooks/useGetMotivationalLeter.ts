import { MotivationalLetterParams } from '@/app/api/generate-motivational-letter/route'
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
    checked: string[]
  ) => {
    if (!positionDetails)
      return setsnackbarMessage('Please provide position details')
    setLoading(true)
    try {
      const res = await fetch('/api/motivational-letter', {
        method: 'POST',
        body: JSON.stringify({
          candidate: reduxCvProps,
          jobDescription: positionDetails,
          strongPoints: checked,
        } as MotivationalLetterParams),
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
