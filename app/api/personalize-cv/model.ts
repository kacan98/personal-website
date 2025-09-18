import { CVSettings } from '@/types'
import { z } from 'zod'
import { JobCVIntersectionResponse } from '../job-cv-intersection/model'

// Comprehensive response schema for single API call
export const ComprehensiveCVAnalysisResponse = z.object({
  personalizedCV: z.record(z.any()).describe("The personalized CV structure matching the original format"),
  positionSummary: z.string(),
  companyName: z.string().nullable(),
  languagePostIsWrittenIn: z.string(),
  matchAnalysis: z.object({
    rating: z.number().min(1).max(10),
    whatIsGood: z.array(z.string()),
    potentialImprovements: z.array(z.string()),
    missingFromCV: z.array(z.string())
  })
})

export type ComprehensiveCVAnalysisType = z.infer<typeof ComprehensiveCVAnalysisResponse>

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