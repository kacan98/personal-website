import { z } from 'zod'
import { CvSection } from '@/sanity/schemaTypes/singletons/cvSettings'

export const adjustSectionAPIEndpointName = '/api/adjust-section'

export const AdjustSectionParams = z.object({
  section: z.any(), // CvSection type
  positionDescription: z.string(),
  sectionType: z.enum(['experience', 'education', 'skills', 'other']).optional(),
})

export type AdjustSectionParams = z.infer<typeof AdjustSectionParams>

export interface AdjustSectionResponse {
  adjustedSection: CvSection
}
