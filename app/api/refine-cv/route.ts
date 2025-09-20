import { CVSettings } from '@/types'
import { OpenAI } from 'openai'
import { RefineCvParams, RefineCvRequest, RefineCvResponseData } from './model'
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { OPENAI_API_KEY } from '@/lib/env'

export const runtime = 'nodejs';

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

    // Validate request
    try {
      RefineCvParams.parse(body)
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
- Use the ORIGINAL CV as reference for the candidate's baseline experience to avoid making up information
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
      completion = await openai.chat.completions.parse({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'user',
            content: 'You are an expert CV writer helping to refine a candidate\'s CV based on specific feedback and additional information.',
          },
          {
            role: 'user',
            content: `ORIGINAL CV (reference for candidate's actual experience):\n${JSON.stringify(body.originalCv, null, 2)}`,
          },
          {
            role: 'user',
            content: `CURRENT CV (starting point - apply refinements to this version):\n${JSON.stringify(body.currentCv, null, 2)}`,
          },
          {
            role: 'user',
            content: refinementInstructions,
          },
          {
            role: 'user',
            content: 'Please refine the CV and return it in the exact same JSON format. Make thoughtful improvements while staying truthful to the candidate\'s actual experience.',
          },
        ],
        response_format: {
          type: 'json_object',
        },
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

    let refinedCv: CVSettings
    try {
      refinedCv = JSON.parse(completion.choices[0].message.content)
    } catch (e) {
      console.error('POST /api/refine-cv - Failed to parse OpenAI response:', e)
      return new Response(JSON.stringify({
        error: 'Failed to parse refined CV from OpenAI response',
        details: e instanceof Error ? e.message : 'Invalid JSON from OpenAI'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

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