import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model'
import OpenAI from 'openai'
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { OPENAI_API_KEY } from '@/lib/env'

export type LetterTranslateParams = {
  targetLanguage: string
  letter: MotivationalLetterResponse
}

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  // Check authentication when required
    // Always check authentication
    const authResult = await checkAuthFromRequest(req)
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

  const body: LetterTranslateParams = await req.json()

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  })

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'user',
          content: `Translate this motivational letter to ${body.targetLanguage}:

${body.letter.letter}

Keep technical terms in English when appropriate. Maintain the professional tone and structure of the letter.

Example:
- BAD: "Implemented features and fixed bugs" => "Implementoval jsem funkce a opravoval chyby"
- GOOD: "Implementoval features a opravoval bugy"

- BAD: "unit tests" => "jednotkové testy"
- GOOD: "unit tests" => "unit testy"

Return only the translated letter text.`,
        },
      ],
    })

    const translatedContent = response.choices[0].message.content;

    if (translatedContent) {
      // Clean up em dashes and fix spacing around commas
      const cleanedLetter = translatedContent.replace(/\s*—\s*/g, ', ');

      const result: MotivationalLetterResponse = {
        letter: cleanedLetter
      };

      return new Response(JSON.stringify(result), {
        status: 200,
      })
    }

    throw new Error('Failed to translate letter')
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
