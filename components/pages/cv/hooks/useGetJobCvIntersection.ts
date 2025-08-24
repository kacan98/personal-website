import {
  jobCvIntersectionAPIEndpointName,
  JobCvIntersectionParams,
  JobCvIntersectionResponse,
} from '@/app/api/job-cv-intersection/model'
import { CVSettings } from '@/types'
import { useCallback } from 'react'

interface JobCvIntersectionProps {
  reduxCvProps: CVSettings
  positionDetails: string

  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  setPositionIntersection: (intersection: JobCvIntersectionResponse) => void
}

export const useGetJobCvIntersection = (props: JobCvIntersectionProps) => {
  const {
    reduxCvProps,
    positionDetails,
    setLoading,
    setsnackbarMessage,
    setPositionIntersection,
  } = props
  const updatePositionIntersection = useCallback(async () => {
    if (!positionDetails) {
      return setsnackbarMessage('Please provide position details')
    }

    setLoading(true)

    try {
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
