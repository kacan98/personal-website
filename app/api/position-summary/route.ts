import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { z } from 'zod'

const PositionSummarizeParams = z.object({
  description: z.string().min(20, 'Description too short'),
})

export type PositionSummarizeParams = z.infer<typeof PositionSummarizeParams>

const PositionSummarizeResponse = z.object({
  summary: z.string(),
  companyName: z.string().optional(),
  languagePostIsWrittineIn: z.string(),
})

export type PositionSummarizeResponse = z.infer<
  typeof PositionSummarizeResponse
>

export async function POST(req: Request): Promise<Response> {
  try {
    const body: PositionSummarizeParams = await req.json()

    //now validate the request
    PositionSummarizeParams.parse(body)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-5',
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
      response_format: zodResponseFormat(PositionSummarizeResponse, 'transformed_cv'),
    })

    const content = completion.choices[0].message.content
    if (!content) return new Response('No summary found', { status: 400 })

    const { summary, companyName, languagePostIsWrittineIn } = JSON.parse(
      content
    ) as PositionSummarizeResponse

    const response: PositionSummarizeResponse = {
      summary,
      companyName,
      languagePostIsWrittineIn
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
