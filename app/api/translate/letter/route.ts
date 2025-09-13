import { MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model'
import OpenAI from 'openai'
import { zodResponseFormat } from "openai/helpers/zod"
import { MotivationalLetterSchema } from '../../motivational-letter/motivational-letter.model'

export type LetterTranslateParams = {
  targetLanguage: string
  letter: MotivationalLetterResponse
}

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  // Check if in production mode and disable endpoint
  if (process.env.NODE_ENV === 'production') {
    console.log('POST /api/translate/letter - Blocked in production mode')
    return new Response(JSON.stringify({ error: 'This endpoint is disabled in production mode' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const body: LetterTranslateParams = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  try {
    const response = await openai.chat.completions.parse({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'user',
          content: `Translate this motivational letter to ${body.targetLanguage}:
          
${JSON.stringify(body.letter, null, 2)}

Keep technical terms in English when appropriate. Maintain the professional tone and structure of the letter.

Example: 
- BAD: "Implemented features and fixed bugs" => "Implementoval jsem funkce a opravoval chyby" 
- GOOD: "Implementoval features a opravoval bugy"

- BAD: "unit tests" => "jednotkové testy"
- GOOD: "unit tests" => "unit testy"

Return the translated letter in the same structured format.`,
        },
      ],
      response_format: zodResponseFormat(
        MotivationalLetterSchema,
        'translated_letter'
      ),
    })

    return new Response(JSON.stringify(response.choices[0].message.parsed), {
      status: 200,
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
