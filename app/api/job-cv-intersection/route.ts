import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { JobCvIntersectionParams, JobCVIntersectionResponse } from './model'

export async function POST(req: Request): Promise<Response> {
  const body: JobCvIntersectionParams = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  try {
    const response = await openai.chat.completions.parse({
      model: 'gpt-5-mini',
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
          
          Make sure to return this in a json format as described.

          Be brief and to the point. Lists are good.
          `,
        },
      ],
      response_format: zodResponseFormat(JobCVIntersectionResponse, 'transformed_cv'),
    })

    return new Response(response.choices[0].message.content, {
      status: 200,
    })

  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
