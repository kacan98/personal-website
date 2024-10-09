import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { OpenAI } from 'openai'
import { PositionSummarizeResponse } from '../position-summary/route'
import { log } from '../helper'
import { z } from 'zod'

const CVUpgradeParams = z.object(
  //can be any object doesn't matter the content
  {
    cvBody: z.object({}),
    positionWeAreApplyingFor: z.string().optional(),
    positionSummary: z.string().optional(),
  }
)

export type CvUpgradeParams = z.infer<typeof CVUpgradeParams>

const CVUpgradeResponse = z.object({
  cv: z.record(z.unknown()),
  newPositionSummary: z.string().optional(),
  companyName: z.string().optional(),
})

type ZodCvUpgradeResponse = z.infer<typeof CVUpgradeResponse>
export interface CvUpgradeResponse extends ZodCvUpgradeResponse {
  cv: CVSettings
}

const baseUrl = process.env.VERCEL_URL
  ? 'https://' + process.env.VERCEL_URL
  : 'http://localhost:3000'

export async function POST(req: Request): Promise<Response> {
  try {
    const body: CvUpgradeParams = await req.json()

    CVUpgradeParams.parse(body)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    let positionSummary = body.positionSummary

    //summarize the CV
    let newPositionSummary: string | undefined
    let companyName: string | undefined
    if (body.positionWeAreApplyingFor && !positionSummary) {
      log(
        '[personalize-cv] positionSummary not provided, fetching from /api/position-summary'
      )
      //call another endpoint to summarize the position
      const resultOfCall: PositionSummarizeResponse = await fetch(
        `${baseUrl}/api/position-summary`,
        {
          method: 'POST',
          body: body.positionWeAreApplyingFor,
        }
      ).then((res) => res.json())
      log('[personalize-cv] positionSummary fetched from /api/position-summary')
      newPositionSummary = resultOfCall.summary
      positionSummary = newPositionSummary
      companyName = resultOfCall.companyName
    }

    log('[personalize-cv] starting with upgrading the CV')
    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `
        You are an elite HR specializing at getting people their dream jobs. A candidate sent you a cv.`,
        },
        {
          role: 'user',
          content: JSON.stringify(body.cvBody),
        },
        {
          role: 'user',
          content: `
          The candidate is applying for a position: ${positionSummary}.
          
          Improve the CV. Don't lie, but make it cusomized for the position.

          Don't be afraid to remove irrelevant information.
          `,
        },
        {
          role: 'user',
          content: 'Please make sure to keep it in the json format.',
        },
      ],
      max_tokens: 2500,
      response_format: {
        type: 'json_object',
      },
    })

    log('[personalize-cv] CV upgraded successfully')

    if (completion.choices[0].message.content) {
      const cv: CVSettings = JSON.parse(completion.choices[0].message.content)
      const response: CvUpgradeResponse = {
        cv,
        newPositionSummary,
        companyName,
      }

      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
  return new Response('Error upgrading the CV', { status: 500 })
}
