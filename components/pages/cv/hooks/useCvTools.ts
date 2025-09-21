import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model'
import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model'
import { updateCvWithChanges } from '@/redux/slices/cv'
import { CVSettings } from '@/types'
import { useDispatch } from 'react-redux'
import { useAdjustCvBasedOnPosition } from './useAdjustCvBasedOnPosition'
import { useAdjustMotivationalLetter } from './useAdjustMotivationalLetter'
import { useAdjustSection } from './useAdjustSection'
import { useLetterTranslation } from './useLetterTranslation'
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
  setLanguage,
  setCacheStatus,
  extractedCompanyName
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
  setCacheStatus?: (fromCache: boolean) => void
  extractedCompanyName?: string | null
}) => {
  const dispatch = useDispatch()

  const updateCvInRedux = (cv: CVSettings) => {
    dispatch(updateCvWithChanges(cv))
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
    companyName: extractedCompanyName,
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
    setCacheStatus,
  })
  const { translateCv, translateCvWithoutLoading } = useCvTranslation({
    setLoading,
    setsnackbarMessage,
    updateCvInRedux,
  })

  const { translateLetter, translateLetterWithoutLoading } = useLetterTranslation({
    setLoading,
    setsnackbarMessage,
    setMotivationalLetter,
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
    translateCvWithoutLoading,
    translateLetter,
    translateLetterWithoutLoading,
    adjustSection,
  }
}
