import { CVSettingsSchema } from '@/types'
import { z } from 'zod'
import { JobCVIntersectionResponse } from '../job-cv-intersection/model'

// Request schema - uses CVSettingsSchema for validation
export const CVUpgradeParams = z.object({
  cvBody: CVSettingsSchema,
  positionWeAreApplyingFor: z.string(),
  positionSummary: z.string().nullable().optional(),
  positionIntersection: JobCVIntersectionResponse.nullable().optional(),
})

export type CvUpgradeParams = z.infer<typeof CVUpgradeParams>

// Response schema - uses CVSettingsSchema for validation
export const CVUpgradeResponse = z.object({
  cv: CVSettingsSchema, // Fully validated CV structure!
  newPositionSummary: z.string().nullable().optional(),
  newJobIntersection: JobCVIntersectionResponse.nullable().optional(),
  companyName: z.string().nullable().optional(),
  _cacheInfo: z.object({
    fromCache: z.boolean(),
    cacheKey: z.string().optional(),
  }).optional(),
})

export type CvUpgradeResponse = z.infer<typeof CVUpgradeResponse>

export const personalizeCvAPIEndpointName = '/api/personalize-cv'

// Comprehensive response schema for single API call
export const ComprehensiveCVAnalysisResponse = z.object({
  personalizedCV: CVSettingsSchema.describe("The personalized CV structure matching the original format"),
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