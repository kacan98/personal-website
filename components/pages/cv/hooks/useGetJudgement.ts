import {
  JobCvIntersectionParams,
  JobCvIntersectionResponse,
} from '@/app/api/job-cv-intersection/route'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { useCallback } from 'react'

export const useGetJudgement = (props: {
  reduxCvProps: CVSettings
  positionDetails: string
  setJudgement: (judgement: JobCvIntersectionResponse) => void
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
}) => {
  const {
    reduxCvProps,
    positionDetails,
    setJudgement,
    setLoading,
    setsnackbarMessage,
  } = props

  const getJudgement = useCallback(async () => {
    if (!positionDetails)
      return setsnackbarMessage('Please provide position details')
    setLoading(true)
    try {
      const getJudgementParams: JobCvIntersectionParams = {
        candidate: reduxCvProps,
        jobDescription: positionDetails,
      }

      const res = await fetch('/api/job-cv-intersection', {
        method: 'POST',
        body: JSON.stringify(getJudgementParams),
      })
      const body: JobCvIntersectionResponse = await res.json()
      setJudgement(body)
    } catch (err) {
      setsnackbarMessage('Error getting a judgement')
    }
    setLoading(false)
  }, Object.values(props))

  return { getJudgement }
}
