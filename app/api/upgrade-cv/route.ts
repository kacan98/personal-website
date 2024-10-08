import { CVSettings } from '@/sanity/schemaTypes/singletons/cvSettings'
import { OpenAI } from 'openai'

export type CvUpgradeParams = {
  cvBody: CVSettings
  positionWeAreApplyingFor?: string
  positionSummary?: string
}

export async function POST(req: Request): Promise<Response> {
  const body: CvUpgradeParams = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  let positionSummary = body.positionSummary

  //summarize the CV
  if (body.positionWeAreApplyingFor && !positionSummary) {
    //call another endpoint to summarize the position
    positionSummary = await fetch('/api/position-summary', {
      method: 'POST',
      body: JSON.stringify({ description: body.positionWeAreApplyingFor }),
    }).then((res) => res.text())
  }

  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: `
        You are an elite HR specializing at getting people their dream jobs. A candidate sent you a cv.`,
      },
      {
        role: 'user',
        content: JSON.stringify(body.cvBody),
      },
      {
        role: 'user',
        content: `
          The candidate is applying for a position: ${positionSummary}.
          
          Improve the CV. Don't lie, but make it cusomized for the position.
          `,
      },
      {
        role: 'user',
        content: 'Please make sure to keep it in the json format.',
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
