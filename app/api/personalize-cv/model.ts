import { CVSettings } from '@/types'
import { z } from 'zod'
import { JobCVIntersectionResponse } from '../job-cv-intersection/model'

export const CVUpgradeResponse = z.object({
  cv: z.record(z.unknown()),
  newPositionSummary: z.string().optional(),
  newJobIntersection: JobCVIntersectionResponse.optional(),
  companyName: z.string().optional(),
})

export const personalizeCvAPIEndpointName = '/api/personalize-cv'

type ZodCvUpgradeResponse = z.infer<typeof CVUpgradeResponse>

export interface CvUpgradeResponse extends ZodCvUpgradeResponse {
  cv: CVSettings
}

export const CVUpgradeParams = z.object(
  {
    cvBody: z.record(z.any()),
    positionWeAreApplyingFor: z.string(),
    positionSummary: z.string().optional(),
    positionIntersection: JobCVIntersectionResponse.optional(),
  }
)

export type ZodCvUpgradeParams = z.infer<typeof CVUpgradeParams>

export interface CvUpgradeParams extends ZodCvUpgradeParams {
  cvBody: CVSettings
}