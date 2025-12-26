import { CVSettingsSchema } from '@/types'
import { z } from 'zod'

// Request schema - uses CVSettingsSchema for validation
export const RefineCvRequest = z.object({
  originalCv: CVSettingsSchema.optional(), // Original CV as baseline (optional - can be omitted to focus on current CV only)
  currentCv: CVSettingsSchema, // Current (potentially modified) CV
  checkedImprovements: z.array(z.string()).optional(), // Selected improvements from position analysis
  improvementInputs: z.record(z.string()).optional(), // User inputs for specific improvements
  missingSkills: z.string().nullable().optional(), // Skills/experience user has but missing from CV
  otherChanges: z.string().nullable().optional(), // Other specific changes requested
  positionContext: z.string().nullable().optional(), // Optional position context for relevance
})

export type RefineCvRequest = z.infer<typeof RefineCvRequest>

// Response schema - uses CVSettingsSchema for validation
export const RefineCvResponse = z.object({
  cv: CVSettingsSchema, // Refined CV - fully validated!
  changesApplied: z.array(z.string()).optional(), // List of changes that were applied
  refinementSummary: z.string().nullable().optional(), // Summary of what was changed
})

export type RefineCvResponseData = z.infer<typeof RefineCvResponse>

export const refineCvAPIEndpointName = '/api/refine-cv'