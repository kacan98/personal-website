import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { OpenAI } from 'openai'
import { PositionSummarizeResponse } from '../position-summary/route'

export type CvUpgradeParams = {
  cvBody: CVSettings
  positionWeAreApplyingFor?: string
  positionSummary?: string
}

export type CvUpgradeResponse = {
  cv: CVSettings
  newPositionSummary?: string
  companyName?: string
}

const DEV = process.env.NODE_ENV === 'development'
const log = (message: string) => {
  if (DEV) {
    console.log(message)
  }
}

const baseUrl = process.env.VERCEL_URL
  ? 'https://' + process.env.VERCEL_URL
  : 'http://localhost:3000'

export async function POST(req: Request): Promise<Response> {
  const body: CvUpgradeParams = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  let positionSummary = body.positionSummary
  try {
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
          body: JSON.stringify({ description: body.positionWeAreApplyingFor }),
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
