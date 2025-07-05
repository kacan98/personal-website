import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model'
import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model'
import { initCv } from '@/redux/slices/cv'
import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { useDispatch } from 'react-redux'
import { useAdjustCvBasedOnPosition } from './useAdjustCvBasedOnPosition'
import { useAdjustMotivationalLetter } from './useAdjustMotivationalLetter'
import { useAdjustSection } from './useAdjustSection'
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
  setLanguage
}: {
  reduxCvProps: CVSettings
  positionDetails: string
  positionSummary: string
  positionIntersection: JobCvIntersectionResponse | null
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  setMotivationalLetter: (motivationalLetter: MotivationalLetterResponse) => void
  setPositionIntersection: (intersection: JobCvIntersectionResponse) => void
  setPositionSummary: (summary: string) => void
  setCompanyName: (companyName: string) => void
  setLanguage: (language: string) => void
}) => {
  const dispatch = useDispatch()

  const updateCvInRedux = (cv: CVSettings) => {
    dispatch(initCv(cv))
  }

  const { getMotivationalLetter } = useGetMotivationalLetter({
    setsnackbarMessage,
    reduxCvProps,
    setMotivationalLetter,
  })

  const { adjustMotivationalLetter } = useAdjustMotivationalLetter({
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
    setLanguage
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

  const { adjustSection } = useAdjustSection({
    setLoading,
    setSnackbarMessage: setsnackbarMessage,
  })

  return {
    getMotivationalLetter,
    adjustMotivationalLetter,
    updatePositionIntersection,
    getSummary: updateSummary,
    adjustCvBasedOnPosition,
    translateCv,
    adjustSection,
  }
}
