import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { z } from 'zod'

export type PositionSummarizeParams = {
  description: string
}

export type PositionSummarizeResponse = {
  summary: string
  companyName?: string
}

export async function POST(req: Request): Promise<Response> {
  const body: PositionSummarizeParams = await req.json()

  //throw error if too short
  if (body.description.length < 20) {
    return new Response('Description too short', { status: 400 })
  }

  const ResponseZod = z.object({
    summary: z.string(),
    companyName: z.string(),
  })

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `You are a hiring manager for this position:`,
        },
        {
          role: 'user',
          content: body.description,
        },
        {
          role: 'user',
          content:
            'Please take out what is the most imporatant about the candidate you are going to hire?',
        },
        {
          role: 'user',
          content:
            'Be brief and to the point. Return it in a json object with the summary and the company name if available.',
        },
      ],
      response_format: zodResponseFormat(ResponseZod, 'transformed_cv'),
    })

    const content = completion.choices[0].message.content
    if (!content) return new Response('No summary found', { status: 400 })

    const { summary, companyName } = JSON.parse(content) as PositionSummarizeResponse

    const response: PositionSummarizeResponse = {
      summary,
      companyName,
    }

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
