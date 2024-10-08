import OpenAI from 'openai'

export type PositionSummarizeParams = {
  description: string
}

export async function POST(req: Request): Promise<Response> {
  const body: PositionSummarizeParams = await req.json()

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  try {
    const response = await openai.beta.chat.completions.parse({
      model: 'chatgpt-4o-latest',
      messages: [
        {
          role: 'user',
          content: `You are a hiring manager for this position:`,
        },
        {
          role: 'user',
          content: body.description,
        },
        {
          role: 'user',
          content:
            'Please take out what is the most imporatant about the candidate you are going to hire?',
        },
        {
          role: 'user',
          content: 'Be brief and to the point',
        },
      ],
    })
    return new Response(response.choices[0].message.content, {
      status: 200,
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
