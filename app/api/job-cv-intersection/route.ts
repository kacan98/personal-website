import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { z } from 'zod'

export type JobCvIntersectionParams = {
  candidate: CVSettings
  jobDescription: string
}

export type JobCvIntersectionResponse = {
  opinion: string
  whatIsMissing: string
  whatIsGood: string
  motivationalLetter: string
  rating: number
}

export async function POST(req: Request): Promise<Response> {
  const body: JobCvIntersectionParams = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const ResponseZod = z.object({
    opinion: z.string(),
    whatIsMissing: z.string(),
    whatIsGood: z.string(),
    motivationalLetter: z.string(),
    rating: z.number(),
  })

  try {
    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `You are a hiring manager for this position:`,
        },
        {
          role: 'user',
          content: body.jobDescription,
        },
        {
          role: 'user',
          content: 'And here is a candidate:',
        },
        {
          role: 'user',
          content: JSON.stringify(body.candidate),
        },
        {
          role: 'user',
          content: `What do you think about this candidate?
          Say your opinion, what is missing in the CV? What is good about the CV?
          Rate the candidate from 1 to 10.
          Also write a motivated letter for this candidate mentioning the good things and how the candidate would fit the position.
          
          Make sure to return this in a json format as described.

          Be brief and to the point. Lists are good.
          `,
        },
      ],
      response_format: zodResponseFormat(ResponseZod, 'transformed_cv'),
    })

    return new Response(JSON.stringify(response.choices[0].message.content), {
      status: 200,
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
