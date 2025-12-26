import { CVSettingsSchema, CVSettingsSchemaForOpenAI } from '@/types'
import { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { RefineCvRequest, RefineCvResponseData } from './model'
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { OPENAI_API_KEY } from '@/lib/env'
import { OPENAI_MODELS } from '@/lib/openai-service'

export const runtime = 'nodejs';

/**
 * Convert undefined to null recursively for OpenAI compatibility
 * OpenAI Structured Outputs requires all fields to be present (but can be null)
 */
function undefinedToNull<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as T
  }
  if (Array.isArray(obj)) {
    return obj.map(undefinedToNull) as T
  }
  if (typeof obj === 'object') {
    const result: any = {}
    for (const key in obj) {
      result[key] = undefinedToNull(obj[key])
    }
    return result
  }
  return obj
}

export async function POST(req: Request): Promise<Response> {
  try {
    console.log('POST /api/refine-cv - Starting request')

    // Check authentication when required
    // Always check authentication
    const authResult = await checkAuthFromRequest(req)
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse request body
    let body: RefineCvRequest
    try {
      body = await req.json()
      console.log('POST /api/refine-cv - Request body parsed successfully')
    } catch (e) {
      console.error('POST /api/refine-cv - Failed to parse request body:', e)
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body', details: e instanceof Error ? e.message : 'Unknown parsing error' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validate request using Zod schema
    try {
      RefineCvRequest.parse(body)
      console.log('POST /api/refine-cv - Request validation passed')
    } catch (e) {
      console.error('POST /api/refine-cv - Request validation failed:', e)
      return new Response(JSON.stringify({ error: 'Invalid request parameters', details: e instanceof Error ? e.message : 'Validation failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check API key
    if (!OPENAI_API_KEY) {
      console.error('POST /api/refine-cv - OpenAI API key not configured')
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Validate that we have at least some refinement input
    const hasRefinementInput =
      (body.checkedImprovements && body.checkedImprovements.length > 0) ||
      (body.improvementInputs && Object.keys(body.improvementInputs).length > 0) ||
      (body.missingSkills && body.missingSkills.trim().length > 0) ||
      (body.otherChanges && body.otherChanges.trim().length > 0)

    if (!hasRefinementInput) {
      return new Response(JSON.stringify({ error: 'No refinement instructions provided', details: 'Please provide at least one type of refinement input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })

    // Build refinement instructions
    let refinementInstructions = "Please refine this CV based on the following instructions:\n\n"

    if (body.checkedImprovements && body.checkedImprovements.length > 0) {
      refinementInstructions += "IMPROVEMENTS TO INCORPORATE:\n"
      body.checkedImprovements.forEach((improvement, index) => {
        refinementInstructions += `${index + 1}. ${improvement}\n\n`
      })
    }

    if (body.missingSkills && body.missingSkills.trim().length > 0) {
      refinementInstructions += "ADDITIONAL SKILLS & EXPERIENCE (add these to the CV):\n"
      refinementInstructions += `${body.missingSkills.trim()}\n\n`
    }

    if (body.otherChanges && body.otherChanges.trim().length > 0) {
      refinementInstructions += "OTHER SPECIFIC CHANGES:\n"
      refinementInstructions += `${body.otherChanges.trim()}\n\n`
    }

    refinementInstructions += `
IMPORTANT GUIDELINES:
- Use the CURRENT CV as the starting point for these refinements
- In the "IMPROVEMENTS TO INCORPORATE" section:
  * "AI suggested:" shows what gaps or improvements were identified
  * "User said:" shows the candidate's actual experience related to that suggestion
  * Focus on incorporating the "User said" content into the CV, using the AI suggestion as context
- Incorporate the user's actual experiences naturally into the CV by enhancing existing sections or adding relevant details
${body.originalCv ? '- Use the ORIGINAL CV as reference for the candidate\'s baseline experience to avoid making up information' : '- Work only with the CURRENT CV - do not reference any original baseline'}
- Maintain the professional tone and structure of the CV
- Don't make up or exaggerate any experience beyond what's explicitly provided by the user
- Ensure all changes are truthful and based on the provided information
- Keep the JSON structure and format intact
- Prominently feature the user's actual experiences in relevant sections of the CV
${body.positionContext ? `- Keep the position context in mind: ${body.positionContext}` : ''}

Please return the refined CV in the same JSON format.`

    console.log('POST /api/refine-cv - About to call OpenAI API')
    let completion
    try {
      // Build messages array conditionally based on whether originalCv is provided
      const messages: Array<{ role: 'user', content: string }> = [
        {
          role: 'user',
          content: 'You are an expert CV writer helping to refine a candidate\'s CV based on specific feedback and additional information.',
        },
      ];

      // Only include original CV if provided
      if (body.originalCv) {
        messages.push({
          role: 'user',
          content: `ORIGINAL CV (reference for candidate's actual experience):\n${JSON.stringify(undefinedToNull(body.originalCv), null, 2)}`,
        });
      }

      // Always include current CV
      messages.push({
        role: 'user',
        content: `CURRENT CV (starting point - apply refinements to this version):\n${JSON.stringify(undefinedToNull(body.currentCv), null, 2)}`,
      });

      // Add refinement instructions
      messages.push({
        role: 'user',
        content: refinementInstructions,
      });

      // Add final instruction
      messages.push({
        role: 'user',
        content: 'Please refine the CV. Make thoughtful improvements while staying truthful to the candidate\'s actual experience.',
      });

      completion = await openai.chat.completions.parse({
        model: OPENAI_MODELS.LATEST_MINI,
        messages,
        response_format: zodResponseFormat(CVSettingsSchemaForOpenAI, 'refined_cv'),
      })
      console.log('POST /api/refine-cv - OpenAI API call completed successfully')
    } catch (e) {
      console.error('POST /api/refine-cv - OpenAI API call failed:', e)
      return new Response(JSON.stringify({
        error: 'Failed to call OpenAI API for CV refinement',
        details: e instanceof Error ? e.message : 'Unknown OpenAI API error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!completion.choices[0].message.content) {
      console.error('POST /api/refine-cv - No content from OpenAI')
      return new Response(JSON.stringify({ error: 'No refined CV generated by OpenAI' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get the parsed response (OpenAI guarantees it matches CVSettingsSchemaForOpenAI structure)
    const openaiResponse = completion.choices[0].message.parsed

    if (!openaiResponse) {
      console.error('POST /api/refine-cv - No parsed CV from OpenAI')
      return new Response(JSON.stringify({
        error: 'OpenAI did not return a parsed CV',
        details: 'The response was empty or refused'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse through full schema to ensure all fields have their default values
    const refinedCv = CVSettingsSchema.parse(openaiResponse)

    console.log('POST /api/refine-cv - OpenAI response received and validated by Structured Outputs')

    // Generate a summary of changes applied
    const changesApplied: string[] = []
    if (body.checkedImprovements && body.checkedImprovements.length > 0) {
      changesApplied.push(`Incorporated ${body.checkedImprovements.length} position-based improvements`)
    }
    if (body.missingSkills && body.missingSkills.trim().length > 0) {
      changesApplied.push('Added missing skills and experience')
    }
    if (body.otherChanges && body.otherChanges.trim().length > 0) {
      changesApplied.push('Applied specific requested changes')
    }

    const refinementSummary = `CV refined with ${changesApplied.length} types of improvements: ${changesApplied.join(', ')}`

    const response: RefineCvResponseData = {
      cv: refinedCv,
      changesApplied,
      refinementSummary,
    }

    console.log('POST /api/refine-cv - Successfully refined CV')
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (e: any) {
    console.error('POST /api/refine-cv - Unexpected error:', e)
    return new Response(JSON.stringify({ error: 'Internal server error', details: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}