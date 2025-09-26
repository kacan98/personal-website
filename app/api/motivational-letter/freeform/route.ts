import OpenAI from "openai"
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { OPENAI_API_KEY } from '@/lib/env'
import { OPENAI_MODELS } from '@/lib/openai-service'
import { CVSettings } from '@/types'

export const runtime = 'nodejs';

interface FreeformLetterRequest {
  currentLetter: string
  userRequest: string
  positionDetails?: string
  candidate?: CVSettings
  strongPoints?: string[]
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Check authentication when required
    const authResult = await checkAuthFromRequest(req)
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const body: FreeformLetterRequest = await req.json()
    const { currentLetter, userRequest, positionDetails, candidate, strongPoints } = body

    if (!currentLetter || !userRequest) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })

    const systemMessage = `You are helping to modify a motivational letter based on user requests. Follow the user's instructions exactly as they specify. The user has complete control over the format, style, and content.

When making changes, you have access to the candidate's CV data and can reference specific projects, technologies, and experiences from their background to make the letter more personalized and accurate.`

    const userMessage = `Current motivational letter:
${currentLetter}

${positionDetails ? `Position context: ${positionDetails}` : ''}

${candidate ? `Candidate's CV/Background:
${JSON.stringify(candidate, null, 2)}` : ''}

${strongPoints && strongPoints.length > 0 ? `Key points to highlight: ${strongPoints.join(', ')}` : ''}

User's request: ${userRequest}

Please modify the letter according to the user's request. When possible, reference specific projects, technologies, or experiences from the candidate's background to make the changes more personalized and credible.`

    const response = await openai.chat.completions.create({
      model: OPENAI_MODELS.LATEST,
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
    })

    const modifiedLetter = response.choices[0].message.content || ''

    return new Response(JSON.stringify({ letter: modifiedLetter }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e: any) {
    console.error('Error modifying motivational letter:', e)
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}