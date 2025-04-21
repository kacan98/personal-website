import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { z } from 'zod'

export const jobCvIntersectionAPIEndpointName = 'api/job-cv-intersection'

export type JobCvIntersectionParams = {
  candidate: CVSettings
  jobDescription: string
}

export const JobCVIntersectionResponse = z.object({
  opinion: z.string(),
  whatIsMissing: z.array(z.object({
    description: z.string(),
    whatWouldImproveTheCv: z.string(),
  })),
  whatIsGood: z.array(z.string()),
  rating: z.number(),
})

export type JobCvIntersectionResponse = typeof JobCVIntersectionResponse._type