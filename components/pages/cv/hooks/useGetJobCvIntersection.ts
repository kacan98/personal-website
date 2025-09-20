import {
  jobCvIntersectionAPIEndpointName,
  JobCvIntersectionParams,
  JobCvIntersectionResponse,
} from '@/app/api/job-cv-intersection/model'
import { CVSettings } from '@/types'
import { useCallback } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { setCurrentPosition } from '@/redux/slices/improvementDescriptions'

interface JobCvIntersectionProps {
  reduxCvProps: CVSettings
  positionDetails: string

  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  setPositionIntersection: (intersection: JobCvIntersectionResponse) => void
  companyName?: string | null
}

export const useGetJobCvIntersection = (props: JobCvIntersectionProps) => {
  const {
    reduxCvProps,
    positionDetails,
    setLoading,
    setsnackbarMessage,
    setPositionIntersection,
    companyName,
  } = props
  const dispatch = useAppDispatch()
  const updatePositionIntersection = useCallback(async () => {
    if (!positionDetails) {
      return setsnackbarMessage('Please provide position details')
    }

    setLoading(true)

    try {
      // Set current position in Redux for improvement tracking
      dispatch(setCurrentPosition({
        positionDetails: positionDetails.trim(),
        companyName: companyName || 'Unknown Company'
      }));

      const res = await fetch(jobCvIntersectionAPIEndpointName, {
        method: 'POST',
        body: JSON.stringify({
          candidate: reduxCvProps,
          jobDescription: positionDetails
        } as JobCvIntersectionParams),
      })
      const body: JobCvIntersectionResponse = await res.json()
      setPositionIntersection(body)
    } catch {
      setsnackbarMessage('Error getting a intersection')
    }

    setLoading(false)
  }, Object.values(props))

  return { updatePositionIntersection }
}
