import { OpenAI } from 'openai'
import { AutoFillImprovementsParams, AutoFillImprovementsResponse } from './model'
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { OPENAI_API_KEY } from '@/lib/env'

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  try {
    console.log('POST /api/auto-fill-improvements - Starting request')

    // Check authentication
    const authResult = await checkAuthFromRequest(req)
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse request body
    let body: AutoFillImprovementsParams
    try {
      body = await req.json()
      console.log('POST /api/auto-fill-improvements - Request body parsed successfully')
    } catch (e) {
      console.error('POST /api/auto-fill-improvements - Failed to parse request body:', e)
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body', details: e instanceof Error ? e.message : 'Unknown parsing error' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validate request
    try {
      AutoFillImprovementsParams.parse(body)
      console.log('POST /api/auto-fill-improvements - Request validation passed')
    } catch (e) {
      console.error('POST /api/auto-fill-improvements - Request validation failed:', e)
      return new Response(JSON.stringify({ error: 'Invalid request parameters', details: e instanceof Error ? e.message : 'Validation failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check API key
    if (!OPENAI_API_KEY) {
      console.error('POST /api/auto-fill-improvements - OpenAI API key not configured')
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Early return if no historical data
    if (Object.keys(body.historicalPositions).length === 0) {
      console.log('POST /api/auto-fill-improvements - No historical data available')
      return new Response(JSON.stringify({
        autoFilledImprovements: {}
      } as AutoFillImprovementsResponse), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Extract all historical improvement descriptions
    const historicalDescriptions: Array<{
      improvement: string
      description: string
      positionTitle: string
    }> = []

    Object.values(body.historicalPositions).forEach(position => {
      Object.entries(position.improvements).forEach(([improvement, data]) => {
        if (data.userDescription.trim().length > 0) {
          historicalDescriptions.push({
            improvement,
            description: data.userDescription.trim(),
            positionTitle: position.positionTitle
          })
        }
      })
    })

    if (historicalDescriptions.length === 0) {
      console.log('POST /api/auto-fill-improvements - No historical descriptions found')
      return new Response(JSON.stringify({
        autoFilledImprovements: {}
      } as AutoFillImprovementsResponse), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })

    // Build the matching prompt
    const matchingPrompt = `You are an expert at matching job requirements with candidate experience.

NEW IMPROVEMENT SUGGESTIONS TO MATCH:
${body.newImprovements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}

HISTORICAL USER EXPERIENCE DESCRIPTIONS:
${historicalDescriptions.map((hist, i) =>
  `${i + 1}. Improvement: "${hist.improvement}"
     User's experience: "${hist.description}"
     From position: ${hist.positionTitle}`
).join('\n\n')}

TASK:
For each new improvement suggestion, determine if any of the historical user experience descriptions are relevant and could be reused. A match should be made if:
- The skills/technologies are similar (e.g., "PostgreSQL" matches "database experience with PostgreSQL")
- The concept is the same (e.g., "Docker deployment" matches "containerization with Docker")
- The experience is transferable (e.g., "React experience" could apply to "frontend framework experience")

For each new improvement that has a good match, provide:
- shouldSelect: true/false (whether to auto-check this improvement)
- description: the user's historical description (potentially adapted if needed)
- confidence: 0.0-1.0 (how confident you are in this match)
- matchedFrom: the original improvement text it was matched from

Only include improvements that have a confidence of 0.6 or higher.

Respond with a JSON object in this exact format:
{
  "autoFilledImprovements": {
    "improvement text here": {
      "shouldSelect": true,
      "description": "user's historical description here",
      "confidence": 0.85,
      "matchedFrom": "original improvement text"
    }
  }
}`;

    console.log('POST /api/auto-fill-improvements - About to call OpenAI API')
    let completion
    try {
      completion = await openai.chat.completions.parse({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'user',
            content: matchingPrompt,
          },
        ],
        response_format: {
          type: 'json_object',
        },
        temperature: 0.1, // Low temperature for consistent matching
      })
      console.log('POST /api/auto-fill-improvements - OpenAI API call completed successfully')
    } catch (e) {
      console.error('POST /api/auto-fill-improvements - OpenAI API call failed:', e)
      return new Response(JSON.stringify({
        error: 'Failed to call OpenAI API for improvement matching',
        details: e instanceof Error ? e.message : 'Unknown OpenAI API error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!completion.choices[0].message.content) {
      console.error('POST /api/auto-fill-improvements - No content from OpenAI')
      return new Response(JSON.stringify({ error: 'No matching results generated by OpenAI' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let matchingResults: AutoFillImprovementsResponse
    try {
      matchingResults = JSON.parse(completion.choices[0].message.content)
    } catch (e) {
      console.error('POST /api/auto-fill-improvements - Failed to parse OpenAI response:', e)
      return new Response(JSON.stringify({
        error: 'Failed to parse matching results from OpenAI response',
        details: e instanceof Error ? e.message : 'Invalid JSON from OpenAI'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`POST /api/auto-fill-improvements - Successfully matched ${Object.keys(matchingResults.autoFilledImprovements).length} improvements`)
    return new Response(JSON.stringify(matchingResults), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (e: any) {
    console.error('POST /api/auto-fill-improvements - Unexpected error:', e)
    return new Response(JSON.stringify({ error: 'Internal server error', details: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}