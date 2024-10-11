import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/route'
import { initCv } from '@/redux/slices/cv'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { useDispatch } from 'react-redux'
import { useAdjustCvBasedOnPosition } from './useAdjustCvBasedOnPosition'
import { useCvTranslation } from './useCvTranslation'
import { useGetJobCvIntersection } from './useGetJobCvIntersection'
import { useGetMotivationalLetter } from './useGetMotivationalLeter'
import { useGetSummary } from './useGetSummary'

export const useCvTools = ({
  reduxCvProps,
  positionDetails,
  positionSummary,
  setLoading,
  setsnackbarMessage,
  setMotivationalLetter,
  setJudgement,
  setPositionSummary,
  setCompanyName,
}: {
  reduxCvProps: CVSettings
  positionDetails: string
  positionSummary: string
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  setMotivationalLetter: (motivationalLetter: string) => void
  setJudgement: (judgement: JobCvIntersectionResponse) => void
  setPositionSummary: (summary: string) => void
  setCompanyName: (companyName: string) => void
}) => {
  const dispatch = useDispatch()

  const updateCvInRedux = (cv: CVSettings) => {
    dispatch(initCv(cv))
  }

  const { getMotivationalLetter } = useGetMotivationalLetter({
    setLoading,
    setsnackbarMessage,
    reduxCvProps,
    setMotivationalLetter,
  })
  const { getJudgement } = useGetJobCvIntersection({
    setLoading,
    setsnackbarMessage,
    reduxCvProps,
    positionDetails,
    setJudgement,
  })
  const { getSummary } = useGetSummary({
    positionDetails,
    setPositionSummary,
    setCompanyName,
    setLoading,
    setsnackbarMessage,
  })
  const { adjustCvBasedOnPosition } = useAdjustCvBasedOnPosition({
    cvProps: reduxCvProps,
    setLoading,
    setsnackbarMessage,
    updateCvInRedux,
    setCompanyName,
    setPositionSummary,
    positionDetails,
    positionSummary,
  })
  const { translateCv } = useCvTranslation({
    setLoading,
    setsnackbarMessage,
    updateCvInRedux,
  })

  return {
    getMotivationalLetter,
    getJudgement,
    getSummary,
    adjustCvBasedOnPosition,
    translateCv,
  }
}
