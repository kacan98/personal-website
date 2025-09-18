import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { MotivationalLetterSchema } from "../motivational-letter.model"
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { IS_PRODUCTION, OPENAI_API_KEY } from '@/lib/env'
import { OPENAI_MODELS } from '@/lib/openai-service'

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  try {
    // Check authentication when required
    if (IS_PRODUCTION) {
      const authResult = await checkAuthFromRequest(req)
      if (!authResult.authenticated) {
        console.log('POST /api/motivational-letter/adjust - Authentication required')
        return new Response(JSON.stringify({ error: 'Authentication required for letter adjustment' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      console.log('POST /api/motivational-letter/adjust - Authentication verified')
    }

    const body = await req.json()

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })

    const response = await openai.chat.completions.parse({
      model: OPENAI_MODELS.LATEST,
      messages: [
        {
          role: 'system',
          content: `You are helping to adjust a motivational letter based on user feedback. Keep the same authentic, down-to-earth style:

- Use simple, honest language - no corporate buzzwords like "passionate about", "honed my skills", "leverage expertise" 
- Stay short and to the point (200-300 words max)
- Focus on real, specific skill intersections with the job
- Be humble but confident
- Avoid generic AI phrases like "keen and quick to learn" or "next-generation platform"
- Cut wordy expressions like "From what I gather" - be direct
- Make specific mentions of actual projects/experience, not vague descriptions
- End with a strong, direct call to action

The goal is to improve the letter while maintaining its genuine, straightforward tone.`,
        },
        {
          role: 'user',
          content: `Current motivational letter:

GREETING: ${body.currentLetter.greeting || 'No greeting provided'}
OPENING: ${body.currentLetter.opening || 'No opening provided'}
WHY THIS ROLE: ${body.currentLetter.whyThisRole || 'No reason provided'}
KEY STRENGTHS: ${body.currentLetter.keyStrengths ? body.currentLetter.keyStrengths.join(', ') : 'No strengths provided'}
UNIQUE VALUE: ${body.currentLetter.uniqueValue || 'No unique value provided'}
CLOSING: ${body.currentLetter.closing || 'No closing provided'}
SIGNATURE: ${body.currentLetter.signature || 'No signature provided'}

Job: ${body.jobDescription}
CV: ${JSON.stringify(body.candidate, null, 2)}
Feedback: ${body.adjustmentComments}

Adjust the motivational letter based on the feedback while maintaining the professional structure.`,
        },
      ],
      response_format: zodResponseFormat(
        MotivationalLetterSchema,
        'adjusted_motivational_letter'
      ),
    })

    return new Response(JSON.stringify(response.choices[0].message.parsed), {
      status: 200,
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
