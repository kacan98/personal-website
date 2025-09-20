import { z } from 'zod'

export const autoFillImprovementsAPIEndpointName = '/api/auto-fill-improvements'

// Historical improvement data structure (matches Redux slice)
export const HistoricalImprovementData = z.object({
  userDescription: z.string(),
  selected: z.boolean(),
  usedInCV: z.boolean(),
  timestamp: z.number(),
})

export const HistoricalPosition = z.object({
  timestamp: z.number(),
  positionTitle: z.string(),
  companyName: z.string(),
  positionHash: z.string(),
  improvements: z.record(z.string(), HistoricalImprovementData),
})

// Request parameters
export const AutoFillImprovementsParams = z.object({
  newImprovements: z.array(z.string()),
  historicalPositions: z.record(z.string(), HistoricalPosition),
})

export type AutoFillImprovementsParams = z.infer<typeof AutoFillImprovementsParams>

// Auto-filled improvement result
export const AutoFilledImprovement = z.object({
  shouldSelect: z.boolean(),
  description: z.string(),
  confidence: z.number().min(0).max(1),
  matchedFrom: z.string().optional(), // Which historical improvement it matched
})

// Response
export const AutoFillImprovementsResponse = z.object({
  autoFilledImprovements: z.record(z.string(), AutoFilledImprovement),
})

export type AutoFillImprovementsResponse = z.infer<typeof AutoFillImprovementsResponse>