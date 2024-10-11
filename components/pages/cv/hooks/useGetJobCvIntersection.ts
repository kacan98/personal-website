import {
  JobCvIntersectionParams,
  JobCvIntersectionResponse,
} from '@/app/api/job-cv-intersection/route'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { useCallback } from 'react'

interface JobCvIntersectionProps {
  reduxCvProps: CVSettings
  positionDetails: string

  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  setJudgement: (judgement: JobCvIntersectionResponse) => void
}

export const useGetJobCvIntersection = (props: JobCvIntersectionProps) => {
  const {
    reduxCvProps,
    positionDetails,
    setLoading,
    setsnackbarMessage,
    setJudgement,
  } = props
  const getJudgement = useCallback(async () => {
    if (!positionDetails) {
      return setsnackbarMessage('Please provide position details')
    }
    setLoading(true)
    try {
      const res = await fetch('/api/job-cv-intersection', {
        method: 'POST',
        body: JSON.stringify({
          candidate: reduxCvProps,
          jobDescription: positionDetails,
        } as JobCvIntersectionParams),
      })
      const body: JobCvIntersectionResponse = await res.json()
      setJudgement(body)
    } catch {
      setsnackbarMessage('Error getting a judgement')
    }
    setLoading(false)
  }, Object.values(props))
  return { getJudgement }
}
