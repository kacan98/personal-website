import OpenAI from "openai"
import { zodResponseFormat } from "openai/helpers/zod"
import { MotivationalLetterParams, MotivationalLetterSchema } from "./motivational-letter.model"

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json()

    MotivationalLetterParams.parse(body)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Check if this is an adjustment request
    const isAdjustment = body.currentLetter && body.adjustmentComments;

    const systemPrompt = isAdjustment
      ? `Adjust this motivational letter based on user feedback. Keep it natural and honest: Fix what the user asked for while sticking to the authentic tone.

When adjusting, focus on the feedback while keeping the tone conversational and real. Don't add any banned words or phrases.`
      : `Write a natural, conversational motivational letter.

The goal is to sound like you're thinking out loud, not drafting a formal letter.`;

    const userPrompt = isAdjustment
      ? `Current motivational letter:
GREETING: ${body.currentLetter.greeting || 'No greeting provided'}
OPENING: ${body.currentLetter.opening || 'No opening provided'}
WHY THIS ROLE: ${body.currentLetter.whyThisRole || 'No reason provided'}
KEY STRENGTHS: ${body.currentLetter.keyStrengths ? body.currentLetter.keyStrengths.join(', ') : 'No strengths provided'}
UNIQUE VALUE: ${body.currentLetter.uniqueValue || 'No unique value provided'}
CLOSING: ${body.currentLetter.closing || 'No closing provided'}
SIGNATURE: ${body.currentLetter.signature || 'No signature provided'}

Job: ${body.jobDescription}
CV: ${JSON.stringify(body.candidate, null, 2)}
User feedback: ${body.adjustmentComments}

When adjusting, focus on the feedback while keeping the tone conversational and real. Don't add any banned words or phrases.`
      : `Write a natural, conversational motivational letter in ${body.language} for this job. Explain why you're interested in this specific role and why you'd be a good fit.

JOB:
${body.jobDescription}

MY BACKGROUND:
${JSON.stringify(body.candidate, null, 2)}

WHAT TO HIGHLIGHT:
${body.strongPoints?.length > 0 ? body.strongPoints.join(', ') : 'Whatever matches best'}

GUIDELINES:
- Keep it between 250-350 words.
- Start by talking about the work and tech that interest you, not the company’s mission or location.
- Use specific examples from your experience, like "I built a [project] using [technology]," to make it personal.
- Be honest about why you want the job; don’t pretend to care about the company’s mission.
- Use bullet points for "Why I'm a good fit", keeping them short and to the point.
- Only mention technologies listed in the job description.
- Stick to concrete examples, not vague statements.
- Write in a calm, simple tone. No big words or fancy language.
- Don’t exaggerate or make up details.
- Sound like a real person talking to someone you’d like to work with—no corporate jargon or buzzwords.
- End with a personal, conversational closing and a call to action.

BANNED WORDS AND PHRASES:
"instantly", "hands-on", "caught my attention", "to craft", "passionate", "leveraging", "honed", "knack for", "dynamic", "sophisticated", "love", "genuinely", "fantastic", "roll up my sleeves", "make an impact", "tackling", "thrilled", "eager", "cutting-edge", "exciting", "amazing", "without a hitch", "keen and quick to learn", "next-generation platform", "innovative", "state-of-the-art", "world-class", "top-notch", "unparalleled", "revolutionary", "groundbreaking", "transformative", "disruptive", "synergy", "holistic approach", "piqued my interest", "revolutionize", "bridge tech and user-experience"
- Skip fancy adjectives; use plain, honest words.

BANNED OPENINGS:
Never start with your location ("Based in…", "From Copenhagen…", "Living in…"), excitement ("I was thrilled…", "I'm excited…", "caught my eye…"), or generic lines ("I am writing to express…").

STRUCTURE:
Use this as a loose guide, but let the letter flow naturally—no strict section breaks:
- Greeting
- Opening
- Why this role interests you
- Your "Why I'm a good fit" (title this "Why I'm a good fit" if it fits)
- What unique value you bring
- Closing
- Signature

The goal is to sound like you're chatting with someone, not drafting a formal letter.`;

    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: zodResponseFormat(
        MotivationalLetterSchema,
        'motivational_letter'
      ),
    })

    return new Response(JSON.stringify(response.choices[0].message.parsed), {
      status: 200,
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}
