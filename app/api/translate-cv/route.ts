import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

export type CvTranslateParams = {
  cvBody: CVSettings
  targetLanguage: string
  extraGptInput?: string
}

export async function POST(req: Request): Promise<Response> {
  const body: CvTranslateParams = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const BulletPointZod = z.object({
    iconName: z.string(),
    text: z.string(),
    url: z.string().optional(),
  })

  const CvSubSectionZod = z.object({
    title: z.string().optional(),
    subtitles: z
      .object({
        left: z.string().optional(),
        right: z.string().optional(),
      })
      .optional(),
    paragraphs: z.array(z.string()).optional(),
    bulletPoints: z.array(BulletPointZod).optional(),
  })

  const CvSection = z.object({
    title: z.string().optional(),
    subtitles: z
      .object({
        left: z.string().optional(),
        right: z.string().optional(),
      })
      .optional(),
    paragraphs: z.array(z.string()).optional(),
    subSections: z.array(CvSubSectionZod).optional(),
    bulletPoints: z.array(BulletPointZod).optional(),
  })

  const CvZod = z.object({
    on: z.boolean(),
    name: z.string(),
    subtitle: z.string(),
    mainColumn: z.array(CvSection),
    sideColumn: z.array(CvSection),
  })

  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: `
        You are an elite HR specializing at getting people their dream jobs.
          Translate the following json to ${body.targetLanguage} where there is text. 
          Keep links and so as they are. 
          If there are technical terms, prefer to keep them in English.
          Example: 
            BAD: "Implemented features and fixed bugs" => "Implementoval jsem funkce a opravoval chyby" 
            GOOD: "Implementoval features and opravoval bugy".

            Bad: "unit tests" => "jednotkové testy"
            BAD: "unit tests" => "enhetstestning"
            GOOD: "unit tests" => "unit tester/unit testy"
          Return back a json object with the translated text.

          also... ${body.extraGptInput}
          `,
        response_format: zodResponseFormat(CvZod, 'transformed_cv'),
      },
      {
        role: 'user',
        content: JSON.stringify(body.cvBody),
      },
    ],
    max_tokens: 2500,
    response_format: {
      type: 'json_object',
    },
  })

  return new Response(JSON.stringify(completion.choices[0].message.content), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
