import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { OpenAI } from 'openai'
import { z } from 'zod'
import { log } from '../helper'
import {
  PositionSummarizeParams,
  PositionSummarizeResponse,
  positionSummaryAPIRoute,
} from '../position-summary/route'
import { JobCVIntersectionResponse, jobCvIntersectionAPIEndpointName } from '../job-cv-intersection/model'
import { POST as POSTIntersection } from '../job-cv-intersection/route'
import { baseUrl } from '@/util'

export const personalizeCvAPIEndpointName = 'api/personalize-cv'

const CVUpgradeParams = z.object(
  //can be any object doesn't matter the content
  {
    cvBody: z.record(z.any()),
    positionWeAreApplyingFor: z.string(),
    positionSummary: z.string().optional(),
    positionIntersection: JobCVIntersectionResponse.optional(),
  }
)

type ZodCvUpgradeParams = z.infer<typeof CVUpgradeParams>

export interface CvUpgradeParams extends ZodCvUpgradeParams {
  cvBody: CVSettings
}

const CVUpgradeResponse = z.object({
  cv: z.record(z.unknown()),
  newPositionSummary: z.string().optional(),
  newJobIntersection: JobCVIntersectionResponse.optional(),
  companyName: z.string().optional(),
})

type ZodCvUpgradeResponse = z.infer<typeof CVUpgradeResponse>
export interface CvUpgradeResponse extends ZodCvUpgradeResponse {
  cv: CVSettings
}

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
      const positionSummarizeParams: PositionSummarizeParams = {
        description: body.positionWeAreApplyingFor,
      }

      //call another endpoint to summarize the position
      const resultOfCall: PositionSummarizeResponse = await fetch(
        `${baseUrl}/${positionSummaryAPIRoute}`,
        {
          method: 'POST',
          body: JSON.stringify(positionSummarizeParams),
        }
      ).then((res) => res.json())
      log('[personalize-cv] positionSummary fetched from /api/position-summary')
      newPositionSummary = resultOfCall.summary
      positionSummary = newPositionSummary
      companyName = resultOfCall.companyName
    }

    let newJobIntersection = body.positionIntersection;
    if (!body.positionIntersection) {
      const newIntersection = await POSTIntersection(
        new Request(baseUrl + '/' + jobCvIntersectionAPIEndpointName, {
          method: 'POST',
          body: JSON.stringify({
            candidate: body.cvBody,
            jobDescription: body.positionWeAreApplyingFor,
          }),
        })
      )

      newJobIntersection = await newIntersection.json()

      log(
        '[personalize-cv] positionIntersection fetched from /api/job-cv-intersection')
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
          The candidate is applying for a position: ${body.positionWeAreApplyingFor}.
          
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
        newJobIntersection,
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
