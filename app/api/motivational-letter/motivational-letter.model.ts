import { CVSettings } from '@/types'
import { z } from 'zod'

export const MotivationalLetterParams = z.object({
  candidate: z.object({
    on: z.boolean(),
    name: z.string(),
    subtitle: z.string(),
    mainColumn: z.array(z.any()),
    sideColumn: z.array(z.any()),
  }),
  jobDescription: z.string(),
  strongPoints: z.array(z.string()),
  language: z.string(),
  // Optional fields for adjustment
  currentLetter: z.object({
    greeting: z.string().optional(),
    opening: z.string().optional(),
    whyThisRole: z.string().optional(),
    keyStrengths: z.array(z.string()).optional(),
    uniqueValue: z.string().optional(),
    closing: z.string().optional(),
    signature: z.string().optional(),
  }).optional(),
  adjustmentComments: z.string().optional(),
})

type ZodMotivationalLetterParams = z.infer<typeof MotivationalLetterParams>

export interface MotivationalLetterParams extends ZodMotivationalLetterParams {
  candidate: CVSettings
}

export type SelectedStory = {
  id: string
  title: string
  category: string
  relevance: number
  tags: string[]
  url: string
  fullUrl: string
  metrics?: {
    impact?: string
    timeframe?: string
    usersAffected?: string
  }
}

export type MotivationalLetterResponse = {
  letter: string
  selectedStories?: SelectedStory[]
  selectionReasoning?: string
}
