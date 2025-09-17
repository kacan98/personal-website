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
import { withCacheStatus, generateCacheKey, CACHE_CONFIG } from '@/lib/cache-server'
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { IS_PRODUCTION, OPENAI_API_KEY } from '@/lib/env'

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  try {
    console.log('POST /api/personalize-cv - Starting request')

    // Check authentication when required
    if (IS_PRODUCTION) {
      const authResult = await checkAuthFromRequest(req)
      if (!authResult.authenticated) {
        console.log('POST /api/personalize-cv - Authentication required')
        return new Response(JSON.stringify({ error: 'Authentication required for CV personalization' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      console.log('POST /api/personalize-cv - Authentication verified')
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
    if (!OPENAI_API_KEY) {
      console.error('POST /api/personalize-cv - OpenAI API key not configured')
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Generate cache key from request parameters
    const cacheKey = generateCacheKey('personalize-cv', body)
    console.log('POST /api/personalize-cv - Checking cache with key:', cacheKey)

    // Try to get cached response
    try {
      const { data: cachedResult, fromCache } = await withCacheStatus(
        cacheKey,
        async () => {
          console.log('POST /api/personalize-cv - Cache miss, executing full personalization')
          return await personalizeCV(body, req)
        },
        CACHE_CONFIG.PERSONALIZE_CV
      )

      // Log cache status with clear visual indicators
      if (fromCache) {
        console.log('🔵 POST /api/personalize-cv - ⚡ CACHE HIT - Returning cached result')
      } else {
        console.log('🟢 POST /api/personalize-cv - 🤖 FRESH - Generated new result from OpenAI')
      }

      // Include cache status in response
      const responseWithCacheInfo = {
        ...cachedResult,
        _cacheInfo: {
          fromCache,
          cacheKey: process.env.NODE_ENV === 'development' ? cacheKey : undefined
        }
      }

      return new Response(JSON.stringify(responseWithCacheInfo), {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache-Status': fromCache ? 'HIT' : 'MISS',
          'X-Cache-Source': fromCache ? 'disk-cache' : 'openai-api',
        },
      })
    } catch (e: any) {
      console.error('POST /api/personalize-cv - Error during personalization:', e)
      return new Response(JSON.stringify({ error: 'Internal server error', details: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (e: any) {
    console.error('POST /api/personalize-cv - Unexpected error:', e)
    return new Response(JSON.stringify({ error: 'Internal server error', details: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Extract the personalization logic to a separate function
async function personalizeCV(body: CvUpgradeParams, request?: Request): Promise<CvUpgradeResponse> {
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
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
              // Forward cookies from the original request
              'Cookie': request?.headers.get('cookie') || '',
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
        throw new Error(`Failed to get position summary: ${e instanceof Error ? e.message : 'Unknown error in position summary'}`)
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
            headers: {
              'Content-Type': 'application/json',
              // Forward cookies from the original request
              'Cookie': request?.headers.get('cookie') || '',
            },
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
        throw new Error(`Failed to get job intersection analysis: ${e instanceof Error ? e.message : 'Unknown error in job intersection'}`)
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

            Improve the CV to match this position. Keep the CV approximately the same length as the original.
            Focus on adjusting existing content rather than adding lots of new content.
            Do not mention the company name in the CV.
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
      throw new Error(`Failed to call OpenAI API for CV personalization: ${e instanceof Error ? e.message : 'Unknown OpenAI API error'}`)
    }

    if (!completion.choices[0].message.content) {
      console.error('POST /api/personalize-cv - No content from OpenAI')
      throw new Error('No CV generated by OpenAI')
    }

    let cv: CVSettings
    try {
      cv = JSON.parse(completion.choices[0].message.content)
    } catch (e) {
      console.error('POST /api/personalize-cv - Failed to parse OpenAI response:', e)
      throw new Error(`Failed to parse CV from OpenAI response: ${e instanceof Error ? e.message : 'Invalid JSON from OpenAI'}`)
    }

    const response: CvUpgradeResponse = {
      cv,
      newPositionSummary,
      companyName,
      newJobIntersection,
    }

    return response
}
