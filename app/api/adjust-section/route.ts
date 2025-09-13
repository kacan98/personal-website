import { OpenAI } from 'openai'
import { AdjustSectionParams, AdjustSectionResponse } from './model'
import { ADJUST_SECTION_CONFIG, createChatCompletionRequest } from '../shared/prompts'

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  try {
    // Check if in production mode and disable endpoint
    if (process.env.NODE_ENV === 'production') {
      console.log('POST /api/adjust-section - Blocked in production mode')
      return new Response(JSON.stringify({ error: 'This endpoint is disabled in production mode' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const body: AdjustSectionParams = await req.json()

    AdjustSectionParams.parse(body)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
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
