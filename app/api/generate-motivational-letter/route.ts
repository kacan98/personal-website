import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { z } from 'zod'

export type MotivationalLetterParams = {
  candidate: CVSettings
  jobDescription: string
  strongPoints: string[]
}

export type MotivationalLetterResponse = {
  letter: Array<{
    type: 'title' | 'paragraph' | 'list'
    content: string | string[]
  }>
}

const MotivationalLetterSchema = z.array(
  z.object({
    type: z.enum(['title', 'paragraph', 'list']),
    content: z.union([
      z.string(), // for title and paragraph
      z.array(z.string()), // for list items
    ]),
  })
)

export async function POST(req: Request): Promise<Response> {
  const body: MotivationalLetterParams = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
          content: `Write a motivational letter for this candidate mentioning the good things and how the candidate would fit the position.
          Be brief and to the point.`,
        },
      ],
      response_format: zodResponseFormat(
        MotivationalLetterSchema,
        'transformed_letter'
      ),
    })

    return new Response(JSON.stringify(response.choices[0].message.content), {
      status: 200,
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
