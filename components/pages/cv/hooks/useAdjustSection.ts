import { useCallback } from 'react'
import { CvSection } from '@/types'
import { AdjustSectionParams, AdjustSectionResponse, adjustSectionAPIEndpointName } from '@/app/api/adjust-section/model'

export const useAdjustSection = ({
  setLoading,
  setSnackbarMessage,
}: {
  setLoading: (loading: boolean) => void
  setSnackbarMessage: (message: string) => void
}) => {
  const adjustSection = useCallback(async (
    section: CvSection,
    positionDescription: string,
    sectionType?: 'experience' | 'education' | 'skills' | 'other'
  ): Promise<CvSection | null> => {
    if (!positionDescription?.trim()) {
      setSnackbarMessage('Position description is required for section adjustment')
      return null
    }

    setLoading(true)
    try {
      const params: AdjustSectionParams = {
        section,
        positionDescription,
        sectionType,
      }

      const response = await fetch(adjustSectionAPIEndpointName, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: AdjustSectionResponse = await response.json()
      setSnackbarMessage('Section adjusted successfully!')
      return result.adjustedSection as CvSection

    } catch (error) {
      setSnackbarMessage('Failed to adjust section. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }, [setLoading, setSnackbarMessage])

  return { adjustSection }
}
