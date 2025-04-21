import OpenAI from "openai"
import { MotivationalLetterParams } from "./motivational-letter.model"

export async function POST(req: Request): Promise<Response> {
  try {
    const body: MotivationalLetterParams = await req.json()

    MotivationalLetterParams.parse(body)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `You are a charming, confident, and persuasive candidate for this position:`,
        },
        {
          role: 'user',
          content: body.jobDescription,
        },
        {
          role: 'user',
          content: 'And here is about you:',
        },
        {
          role: 'user',
          content: JSON.stringify(body.candidate),
        },
        {
          role: 'user',
          content: `Write a motivational letter in ${body.language} highlighting your strong points and how you would fit the position.
          Make it personal, unique, tailored to the position, and easy to read and understand.
          
          Be brief and to the point.
          
          No bullshit. No fluff. No jargon! Max 2 paragraphs/300 words.

          Basically like you are talking to a friend.

          Ignore formatting and just write the content. I will format it later.
          `,
        },
      ],
      //TODO
      // response_format: zodResponseFormat(
      //   MotivationalLetterSchema,
      //   'transformed_letter'
      // ),
    })

    return new Response(JSON.stringify(response.choices[0].message.content), {
      status: 200,
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
