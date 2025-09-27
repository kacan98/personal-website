import OpenAI from "openai"
import { MotivationalLetterResponse } from "../motivational-letter.model"
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { OPENAI_API_KEY } from '@/lib/env'
import { OPENAI_MODELS } from '@/lib/openai-service'

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  try {
    // Check authentication when required
    // Always check authentication
    const authResult = await checkAuthFromRequest(req)
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const body = await req.json()

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    })

    const response = await openai.chat.completions.create({
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

${body.currentLetter.letter || 'No letter provided'}

Job: ${body.jobDescription}
CV: ${JSON.stringify(body.candidate, null, 2)}
Feedback: ${body.adjustmentComments}

Adjust the motivational letter based on the feedback while maintaining the professional structure.`,
        },
      ],
    })

    const letterContent = response.choices[0].message.content;

    if (letterContent) {
      // Clean up em dashes and fix spacing around commas
      const cleanedLetter = letterContent.replace(/\s*—\s*/g, ', ');

      const result: MotivationalLetterResponse = {
        letter: cleanedLetter
      };

      return new Response(JSON.stringify(result), {
        status: 200,
      })
    }

    throw new Error('Failed to adjust motivational letter')
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
