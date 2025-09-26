import { zodResponseFormat } from "openai/helpers/zod"
import { MotivationalLetterParams, MotivationalLetterSchema } from "./motivational-letter.model"
import { getOpenAIClient, OPENAI_MODELS } from '@/lib/openai-service'
import { withAuth, createErrorResponse } from '@/lib/api-middleware'
import { withCacheStatus, generateCacheKey } from '@/lib/cache-server'
import { CACHE_CONFIG } from '@/lib/cache-config'
import { findRelevantStories } from '@/lib/blog-stories'

export const runtime = 'nodejs';

async function handleMotivationalLetter(req: Request): Promise<Response> {
  try {

    const body = await req.json()

    MotivationalLetterParams.parse(body)

    // Generate cache key from request parameters
    const cacheKey = generateCacheKey('motivational-letter', body)

    // Try to get cached response
    const { data: result, fromCache } = await withCacheStatus(
      cacheKey,
      async () => {
        return await generateMotivationalLetter(body)
      },
      CACHE_CONFIG.MOTIVATIONAL_LETTER
    )

    // Include cache status in response
    const responseWithCacheInfo = {
      ...result,
      _cacheInfo: {
        fromCache,
        cacheKey: process.env.NODE_ENV === 'development' ? cacheKey : undefined
      }
    }

    return new Response(JSON.stringify(responseWithCacheInfo), {
      headers: {
        'Content-Type': 'application/json',
        'X-Cache-Status': fromCache ? 'HIT' : 'MISS',
        'X-Cache-Source': fromCache ? 'disk-cache' : 'openai-api',
      },
    })

  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return createErrorResponse(errorMessage);
  }
}

async function generateMotivationalLetter(body: any) {
  const openai = getOpenAIClient();

  // Get relevant stories for this job
  const relevantStories = await findRelevantStories(body.jobDescription, 5);

    // Check if this is an adjustment request
    const isAdjustment = body.currentLetter && body.adjustmentComments;

    const systemPrompt = isAdjustment
      ? `Adjust this motivational letter based on user feedback. Make the requested changes while maintaining a professional, authentic tone that showcases the candidate's qualifications effectively.`
      : `Write a professional, engaging motivational letter that showcases the candidate's qualifications and genuine interest in the role.

Focus on being authentic, specific, and compelling while maintaining a professional tone.`;

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

Make the requested changes while keeping the letter professional and authentic.`
      : `Write a compelling motivational letter in ${body.language} using the Problem-Solution approach that research shows is most effective. Focus on who the candidate is, what value they bring, and how they solve the company's challenges.

JOB:
${body.jobDescription}

MY BACKGROUND:
${JSON.stringify(body.candidate, null, 2)}

WHAT TO HIGHLIGHT:
${body.strongPoints?.length > 0 ? body.strongPoints.join(', ') : 'Whatever matches best'}

MY PROJECT STORIES (use 2-3 most relevant ones with specific examples):
${relevantStories.map((story, index) => `
${index + 1}. ${story.title}
Category: ${story.category}
${story.metrics?.impact ? `Impact: ${story.metrics.impact}` : ''}
Technologies: ${story.tags.join(', ')}

${story.content.substring(0, 500)}...
`).join('\n---\n')}

RESEARCH-BACKED APPROACH:
Use the Problem-Solution format that outperforms all other cover letter styles:

1. **Who I Am**: Start with a brief professional identity that establishes credibility
2. **Understanding Their Challenge**: Show you understand a specific problem/need they have (from job description)
3. **My Solution**: Connect your background to solving their challenge with specific examples
4. **Quantified Value**: Include measurable results from past achievements when possible
5. **What I'll Bring**: Clear value proposition for this specific role

GUIDELINES:
- Keep it concise (250-350 words max)
- Lead with professional identity, not job title desires
- Show understanding of their specific needs/challenges
- Use concrete examples from the project stories above: "I increased X by Y%" or "I built Z that solved W"
- Include 2-3 quantified achievements from the stories
- Reference specific technologies and metrics from the relevant project stories
- Connect your past success to their future needs
- Write with confidence about your capabilities
- End with clear next steps

TONE:
- Professional and confident
- Solution-focused, not request-focused
- Authentic personality while maintaining professionalism
- Shows understanding of their world
- Positions you as a problem-solver

STRUCTURE:
- Professional greeting
- Who you are professionally (1-2 sentences)
- Understanding of their challenge/need
- How your background solves their problem (with examples)
- Specific value you'll deliver
- Professional closing with call to action

Focus on being a solution provider, not a job seeker asking for something.`;

    const response = await openai.chat.completions.parse({
      model: OPENAI_MODELS.LATEST_MINI,
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

    return response.choices[0].message.parsed;
}

export const POST = withAuth(handleMotivationalLetter);
