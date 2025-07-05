import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
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

export type MotivationalLetterResponse = {
  greeting: string
  opening: string
  whyThisRole: string
  keyStrengths: string[]
  uniqueValue: string
  closing: string
  signature: string
}

export const MotivationalLetterSchema = z.object({
  greeting: z.string().describe("Professional greeting addressing the hiring manager"),
  opening: z.string().describe("Brief, engaging opening paragraph showing genuine interest in the role"),
  whyThisRole: z.string().describe("One paragraph explaining why this specific role/company appeals to you"),
  keyStrengths: z.array(z.string()).describe("3-4 bullet points highlighting relevant skills and experiences that match the job requirements"),
  uniqueValue: z.string().describe("A paragraph about what unique perspective or value you'd bring to the team"),
  closing: z.string().describe("Professional closing paragraph with next steps"),
  signature: z.string().describe("Professional sign-off")
})
