import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { MotivationalLetterSchema } from "../motivational-letter.model"

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json()

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-5',
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
