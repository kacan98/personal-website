import {
  PositionSummarizeParams,
  PositionSummarizeResponse,
} from '@/app/api/position-summary/route'
import { useCallback } from 'react'

export const useGetSummary = (props: {
  positionDetails: string
  setPositionSummary: (summary: string) => void
  setCompanyName: (companyName: string) => void
  setLoading: (loading: boolean) => void
  setsnackbarMessage: (message: string) => void
  setLanguage: (language: string) => void
}) => {
  const {
    positionDetails,
    setPositionSummary,
    setCompanyName,
    setLoading,
    setsnackbarMessage,
    setLanguage
  } = props

  const updateSummary = useCallback(async () => {
    if (!positionDetails)
      return setsnackbarMessage('Please provide position details')

    setLoading(true)

    const positionSummaryParams: PositionSummarizeParams = {
      description: positionDetails,
    }

    try {
      const res: PositionSummarizeResponse = await fetch(
        '/api/position-summary',
        {
          method: 'POST',
          body: JSON.stringify(positionSummaryParams),
        }
      ).then((res) => res.json())
      setPositionSummary(res.summary)
      setLanguage(res.languagePostIsWrittineIn)
      if (res.companyName) setCompanyName(res.companyName)
    } catch (err) {
      setsnackbarMessage('Error summarizing position')
    }
    setLoading(false)
  }, Object.values(props))

  return { updateSummary }
}
