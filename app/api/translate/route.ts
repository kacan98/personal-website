import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import OpenAI from 'openai'

export type CvTranslateParams = {
  targetLanguage: string
  cv: CVSettings
}

export async function POST(req: Request): Promise<Response> {
  const body: CvTranslateParams = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  try {
    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
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
