import { OpenAI } from 'openai'
import { AdjustSectionParams, AdjustSectionResponse } from './model'
import { ADJUST_SECTION_CONFIG, createChatCompletionRequest } from '../shared/prompts'
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { IS_PRODUCTION, OPENAI_API_KEY } from '@/lib/env'

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  try {
    // Check authentication when required
    if (IS_PRODUCTION) {
      const authResult = await checkAuthFromRequest(req)
      if (!authResult.authenticated) {
        console.log('POST /api/adjust-section - Authentication required')
        return new Response(JSON.stringify({ error: 'Authentication required for section adjustment' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      console.log('POST /api/adjust-section - Authentication verified')
    }

    const body: AdjustSectionParams = await req.json()

    AdjustSectionParams.parse(body)

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })
    
    const chatRequest = createChatCompletionRequest(ADJUST_SECTION_CONFIG, {
      positionDescription: body.positionDescription,
      section: body.section,
      sectionType: body.sectionType,
    });

    const completion = await openai.chat.completions.create(chatRequest)

    const response = completion.choices[0].message.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    try {
      const adjustedSection = JSON.parse(response)
      
      const result: AdjustSectionResponse = {
        adjustedSection
      }

      return Response.json(result)
    } catch (parseError) {
      // If JSON parsing fails, return the original section
      const result: AdjustSectionResponse = {
        adjustedSection: body.section
      }
      
      return Response.json(result)
    }

  } catch (error) {
    return Response.json(
      { error: 'Failed to adjust section' },
      { status: 500 }
    )
  }
}
