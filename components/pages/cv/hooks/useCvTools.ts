import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model'
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
  positionIntersection,
  setLoading,
  setsnackbarMessage,
  setMotivationalLetter,
  setPositionIntersection,
  setPositionSummary,
  setCompanyName,
}: {
  reduxCvProps: CVSettings
  positionDetails: string
  positionSummary: string
  positionIntersection: JobCvIntersectionResponse | null
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  setMotivationalLetter: (motivationalLetter: string) => void
  setPositionIntersection: (intersection: JobCvIntersectionResponse) => void
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
  const { updatePositionIntersection } = useGetJobCvIntersection({
    setLoading,
    setsnackbarMessage,
    reduxCvProps,
    positionDetails,
    setPositionIntersection,
  })

  const { updateSummary } = useGetSummary({
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
    setPositionIntersection,
    positionIntersection,
    updateSummary,
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
    updatePositionIntersection,
    getSummary: updateSummary,
    adjustCvBasedOnPosition,
    translateCv,
  }
}
