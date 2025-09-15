import { CVSettings } from '@/types'
import { z } from 'zod'
import { JobCVIntersectionResponse } from '../job-cv-intersection/model'

export const CVUpgradeResponse = z.object({
  cv: z.record(z.unknown()),
  newPositionSummary: z.string().nullable().optional(),
  newJobIntersection: JobCVIntersectionResponse.nullable().optional(),
  companyName: z.string().nullable().optional(),
  _cacheInfo: z.object({
    fromCache: z.boolean(),
    cacheKey: z.string().optional(),
  }).optional(),
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
    positionSummary: z.string().nullable().optional(),
    positionIntersection: JobCVIntersectionResponse.nullable().optional(),
  }
)

export type ZodCvUpgradeParams = z.infer<typeof CVUpgradeParams>

export interface CvUpgradeParams extends ZodCvUpgradeParams {
  cvBody: CVSettings
}