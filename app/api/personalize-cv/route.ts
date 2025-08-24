import { CVSettings } from '@/types'
import { baseUrl } from '@/util'
import { OpenAI } from 'openai'
import { jobCvIntersectionAPIEndpointName } from '../job-cv-intersection/model'
import { POST as POSTIntersection } from '../job-cv-intersection/route'
import { positionSummaryAPIRoute } from '../position-summary/model'
import {
  PositionSummarizeParams,
  PositionSummarizeResponse,
} from '../position-summary/route'
import { CVUpgradeParams, CvUpgradeParams, CvUpgradeResponse } from './model'

export const runtime = 'nodejs';

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

    }

    const completion = await openai.chat.completions.parse({
      model: 'gpt-5-mini',
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
          Do not mention the name of the company in the CV.
          `,
        },
        {
          role: 'user',
          content: 'Please make sure to keep it in the json format.',
        },
      ],
      response_format: {
        type: 'json_object',
      },
    })

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
