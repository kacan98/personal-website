import { CVUpgradeParams, CvUpgradeParams, CvUpgradeResponse } from './model'
import { PositionAnalysisService } from '@/lib/services/position-analysis.service'
import { CVPersonalizationService } from '@/lib/services/cv-personalization.service'
import { withCacheStatus, generateCacheKey, CACHE_CONFIG } from '@/lib/cache-server'
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { IS_PRODUCTION, OPENAI_API_KEY } from '@/lib/env'

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  try {

    // Check authentication when required
    if (IS_PRODUCTION) {
      const authResult = await checkAuthFromRequest(req)
      if (!authResult.authenticated) {
        return new Response(JSON.stringify({ error: 'Authentication required for CV personalization' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    // Parse request body
    let body: CvUpgradeParams
    try {
      body = await req.json()
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

    // Try to get cached response
    try {
      const { data: cachedResult, fromCache } = await withCacheStatus(
        cacheKey,
        async () => {
          return await personalizeCV(body, req)
        },
        CACHE_CONFIG.PERSONALIZE_CV
      )

      // Log cache status with clear visual indicators
      if (fromCache) {
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

// Clean, focused CV personalization using separate services
async function personalizeCV(body: CvUpgradeParams, request?: Request): Promise<CvUpgradeResponse> {
  let positionSummary = body.positionSummary

  // Step 1: Get position analysis if needed (position summary + job intersection)
  let newPositionSummary: string | undefined
  let companyName: string | null | undefined
  let newJobIntersection = body.positionIntersection

  const needsPositionSummary = body.positionWeAreApplyingFor && !positionSummary
  const needsJobIntersection = !body.positionIntersection

  if (needsPositionSummary || needsJobIntersection) {
    const analysisResult = await PositionAnalysisService.analyzePosition(
      body.positionWeAreApplyingFor,
      body.cvBody,
      request,
      {
        skipSummary: !needsPositionSummary,
        skipIntersection: !needsJobIntersection
      }
    )

    if (analysisResult.positionSummary) {
      newPositionSummary = analysisResult.positionSummary
      positionSummary = newPositionSummary
    }
    if (analysisResult.companyName !== undefined) {
      companyName = analysisResult.companyName
    }
    if (analysisResult.jobIntersection) {
      newJobIntersection = analysisResult.jobIntersection
    }
  }

  // Step 2: Personalize the CV
  const personalizedCV = await CVPersonalizationService.personalizeCV({
    cvData: body.cvBody,
    jobDescription: body.positionWeAreApplyingFor,
    positionSummary: positionSummary || undefined
  })

  const response: CvUpgradeResponse = {
    cv: personalizedCV,
    newPositionSummary,
    companyName,
    newJobIntersection,
  }

  return response
}
