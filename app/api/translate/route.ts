import { CVSettings } from '@/types'
import OpenAI from 'openai'
import { checkAuthFromRequest } from '@/lib/auth-middleware'
import { IS_PRODUCTION, OPENAI_API_KEY } from '@/lib/env'

export type CvTranslateParams = {
  targetLanguage: string
  cv: CVSettings
}

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  // Check authentication when required
  if (IS_PRODUCTION) {
    const authResult = await checkAuthFromRequest(req)
    if (!authResult.authenticated) {
      console.log('POST /api/translate - Authentication required')
      return new Response(JSON.stringify({ error: 'Authentication required for CV translation' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    console.log('POST /api/translate - Authentication verified')
  }

  const body: CvTranslateParams = await req.json()

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  })

  try {
    const response = await openai.chat.completions.parse({
      model: 'gpt-5-mini',
      messages: [
        {
          role: 'user',
          content: 'Here is a CV:',
        },
        {
          role: 'user',
          content: JSON.stringify(body.cv),
        },
        {
          role: 'user',
          content: 'Please translate it to ' + body.targetLanguage,
        },
        {
          role: 'user',
          content: `
                Keep links and so as they are. 
                If there are technical terms, prefer to keep them in English.
                Example: 
                    BAD: "Implemented features and fixed bugs" => "Implementoval jsem funkce a opravoval chyby" 
                    GOOD: "Implementoval features and opravoval bugy".

                    Bad: "unit tests" => "jednotkové testy"
                    BAD: "unit tests" => "enhetstestning"
                    GOOD: "unit tests" => "unit tester/unit testy"
                Return back a json object with the translated text.`,
        },
      ],
      response_format: {
        type: 'json_object',
      },
    })
    return new Response(JSON.stringify(response.choices[0].message.content), {
      status: 200,
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
