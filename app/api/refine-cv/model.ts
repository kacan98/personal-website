import { CVSettings } from '@/types'
import { z } from 'zod'

export const RefineCvParams = z.object({
  originalCv: z.record(z.any()), // Original CV as baseline
  currentCv: z.record(z.any()), // Current (potentially modified) CV
  checkedImprovements: z.array(z.string()).optional(), // Selected improvements from position analysis
  improvementInputs: z.record(z.string()).optional(), // User inputs for specific improvements
  missingSkills: z.string().nullable().optional(), // Skills/experience user has but missing from CV
  otherChanges: z.string().nullable().optional(), // Other specific changes requested
  positionContext: z.string().nullable().optional(), // Optional position context for relevance
})

export type RefineCvParams = z.infer<typeof RefineCvParams>

export interface RefineCvRequest extends RefineCvParams {
  originalCv: CVSettings
  currentCv: CVSettings
}

export const RefineCvResponse = z.object({
  cv: z.record(z.unknown()), // Refined CV
  changesApplied: z.array(z.string()).optional(), // List of changes that were applied
  refinementSummary: z.string().nullable().optional(), // Summary of what was changed
})

export type RefineCvResponse = z.infer<typeof RefineCvResponse>

export interface RefineCvResponseData extends RefineCvResponse {
  cv: CVSettings
}

export const refineCvAPIEndpointName = '/api/refine-cv'