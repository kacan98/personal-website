import {
  jobCvIntersectionAPIEndpointName,
  JobCvIntersectionParams,
  JobCvIntersectionResponse,
} from '@/app/api/job-cv-intersection/model'
import { CVSettings } from '@/types'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCurrentPosition, bulkUpdateImprovements } from '@/redux/slices/improvementDescriptions'
import { autoFillImprovementsAPIEndpointName, AutoFillImprovementsParams, AutoFillImprovementsResponse } from '@/app/api/auto-fill-improvements/model'

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

  // Get historical positions for auto-fill
  const historicalPositions = useAppSelector((state) => state.improvementDescriptions.positions)
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

      // Auto-fill improvements based on historical data
      if (body.whatIsMissing && body.whatIsMissing.length > 0) {
        try {
          const newImprovements = body.whatIsMissing.map(item => item.description)
          console.log('Attempting auto-fill with improvements:', newImprovements)
          console.log('Historical positions available:', Object.keys(historicalPositions).length)

          const autoFillRes = await fetch(autoFillImprovementsAPIEndpointName, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              newImprovements,
              historicalPositions
            } as AutoFillImprovementsParams),
          })

          if (autoFillRes.ok) {
            const autoFillData: AutoFillImprovementsResponse = await autoFillRes.json()
            console.log('Auto-fill API response:', autoFillData)

            if (Object.keys(autoFillData.autoFilledImprovements).length > 0) {
              console.log('Dispatching auto-filled improvements to Redux:', autoFillData.autoFilledImprovements)
              // Dispatch auto-filled improvements to Redux
              dispatch(bulkUpdateImprovements({
                autoFilledImprovements: autoFillData.autoFilledImprovements
              }))

              console.log(`Auto-filled ${Object.keys(autoFillData.autoFilledImprovements).length} improvements based on historical data`)
            } else {
              console.log('No auto-fill matches found')
            }
          } else {
            console.warn('Auto-fill API call failed, status:', autoFillRes.status)
            const errorText = await autoFillRes.text()
            console.warn('Auto-fill error response:', errorText)
          }
        } catch (autoFillError) {
          console.error('Error during auto-fill process:', autoFillError)
          // Continue normally even if auto-fill fails
        }
      }
    } catch {
      setsnackbarMessage('Error getting a intersection')
    }

    setLoading(false)
  }, Object.values(props))

  return { updatePositionIntersection }
}
