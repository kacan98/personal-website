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
})

type ZodMotivationalLetterParams = z.infer<typeof MotivationalLetterParams>

export interface MotivationalLetterParams extends ZodMotivationalLetterParams {
  candidate: CVSettings
}

export type MotivationalLetterResponse = {
  letter: Array<{
    type: 'title' | 'paragraph' | 'list'
    content: string | string[]
  }>
}

//TODO: Use to get a nicely formated response
// const MotivationalLetterSchema = z.array(
//   z.object({
//     type: z.enum(['title', 'paragraph', 'list']),
//     content: z.union([
//       z.string(), // for title and paragraph
//       z.array(z.string()), // for list items
//     ]),
//   })
// )
