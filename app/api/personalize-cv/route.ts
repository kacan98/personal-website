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
    console.log('POST /api/personalize-cv - Starting request')

    // Check if in production mode and disable endpoint
    if (process.env.NODE_ENV === 'production') {
      console.log('POST /api/personalize-cv - Blocked in production mode')
      return new Response(JSON.stringify({ error: 'This endpoint is disabled in production mode' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse request body
    let body: CvUpgradeParams
    try {
      body = await req.json()
      console.log('POST /api/personalize-cv - Request body parsed successfully')
    } catch (e) {
      console.error('POST /api/personalize-cv - Failed to parse request body:', e)
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body', details: e instanceof Error ? e.message : 'Unknown parsing error' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validate request
    try {
      CVUpgradeParams.parse(body)
      console.log('POST /api/personalize-cv - Request validation passed')
    } catch (e) {
      console.error('POST /api/personalize-cv - Request validation failed:', e)
      return new Response(JSON.stringify({ error: 'Invalid request parameters', details: e instanceof Error ? e.message : 'Validation failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('POST /api/personalize-cv - OpenAI API key not configured')
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    let positionSummary = body.positionSummary

    //summarize the CV
    let newPositionSummary: string | undefined
    let companyName: string | null | undefined
    if (body.positionWeAreApplyingFor && !positionSummary) {
      console.log('POST /api/personalize-cv - Calling position summary endpoint')
      const positionSummarizeParams: PositionSummarizeParams = {
        description: body.positionWeAreApplyingFor,
      }

      //call another endpoint to summarize the position
      let resultOfCall: PositionSummarizeResponse
      try {
        const positionSummaryResponse = await fetch(
          `${baseUrl}/${positionSummaryAPIRoute}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(positionSummarizeParams),
          }
        )

        if (!positionSummaryResponse.ok) {
          const errorText = await positionSummaryResponse.text()
          console.error('POST /api/personalize-cv - Position summary endpoint failed:', errorText)
          throw new Error(`Position summary endpoint failed (${positionSummaryResponse.status}): ${errorText}`)
        }

        resultOfCall = await positionSummaryResponse.json()
        console.log('POST /api/personalize-cv - Position summary call completed successfully')
      } catch (e) {
        console.error('POST /api/personalize-cv - Position summary call failed:', e)
        return new Response(JSON.stringify({
          error: 'Failed to get position summary',
          details: e instanceof Error ? e.message : 'Unknown error in position summary'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      newPositionSummary = resultOfCall.summary
      positionSummary = newPositionSummary
      companyName = resultOfCall.companyName
    }

    let newJobIntersection = body.positionIntersection;
    if (!body.positionIntersection) {
      console.log('POST /api/personalize-cv - Calling job intersection endpoint')
      try {
        const newIntersection = await POSTIntersection(
          new Request(baseUrl + '/' + jobCvIntersectionAPIEndpointName, {
            method: 'POST',
            body: JSON.stringify({
              candidate: body.cvBody,
              jobDescription: body.positionWeAreApplyingFor,
            }),
          })
        )

        if (!newIntersection.ok) {
          const errorText = await newIntersection.text()
          console.error('POST /api/personalize-cv - Job intersection endpoint failed:', errorText)
          throw new Error(`Job intersection endpoint failed (${newIntersection.status}): ${errorText}`)
        }

        newJobIntersection = await newIntersection.json()
        console.log('POST /api/personalize-cv - Job intersection call completed successfully')
      } catch (e) {
        console.error('POST /api/personalize-cv - Job intersection call failed:', e)
        return new Response(JSON.stringify({
          error: 'Failed to get job intersection analysis',
          details: e instanceof Error ? e.message : 'Unknown error in job intersection'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    console.log('POST /api/personalize-cv - About to call OpenAI API with gpt-5-mini')
    let completion
    try {
      completion = await openai.chat.completions.parse({
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
      console.log('POST /api/personalize-cv - OpenAI API call completed successfully')
    } catch (e) {
      console.error('POST /api/personalize-cv - OpenAI API call failed:', e)
      return new Response(JSON.stringify({
        error: 'Failed to call OpenAI API for CV personalization',
        details: e instanceof Error ? e.message : 'Unknown OpenAI API error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!completion.choices[0].message.content) {
      console.error('POST /api/personalize-cv - No content from OpenAI')
      return new Response(JSON.stringify({ error: 'No CV generated by OpenAI' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let cv: CVSettings
    try {
      cv = JSON.parse(completion.choices[0].message.content)
    } catch (e) {
      console.error('POST /api/personalize-cv - Failed to parse OpenAI response:', e)
      return new Response(JSON.stringify({
        error: 'Failed to parse CV from OpenAI response',
        details: e instanceof Error ? e.message : 'Invalid JSON from OpenAI'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

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
  } catch (e: any) {
    console.error('POST /api/personalize-cv - Unexpected error:', e)
    return new Response(JSON.stringify({ error: 'Internal server error', details: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
