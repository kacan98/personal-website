import { MotivationalLetterParams } from "./motivational-letter.model"
import { z } from 'zod'
import { getOpenAIClient, OPENAI_MODELS } from '@/lib/openai-service'
import { withAuth, createErrorResponse } from '@/lib/api-middleware'
import { withCacheStatus, generateCacheKey } from '@/lib/cache-server'
import { CACHE_CONFIG } from '@/lib/cache-config'
import { findRelevantStories } from '@/lib/project-stories'
import { PROJECT_STORIES_PATH } from '@/lib/routes'
import { getSettings } from '@/data/settings'

export const runtime = 'nodejs';

// Schema for story selection response
const StorySelectionSchema = z.object({
  selectedStoryIds: z.array(z.number()).describe("Array of story numbers (1-based) that would be most relevant for this role. Can be empty if no stories are particularly relevant."),
  reasoning: z.string().describe("Brief explanation of why these stories were chosen, or why none were selected"),
  useStories: z.boolean().describe("Whether any stories should be included in the letter - true only if they add significant value")
});

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
  const settings = getSettings();

  // Get relevant stories for this job
  const relevantStories = await findRelevantStories(body.jobDescription, 5);

  // STEP 1: Present story summaries and ask which ones to explore
  const storySelectionMessages = [
    {
      role: 'system' as const,
      content: `You are helping write a motivational letter. Review the job and available project stories, then decide if any stories add significant value. Only include stories if they directly address challenges mentioned in the job posting or demonstrate highly relevant skills. When in doubt, skip the stories and focus on CV experience instead.`
    },
    {
      role: 'user' as const,
      content: `Should I include project stories in this motivational letter?

JOB POSTING:
${body.jobDescription}

CANDIDATE BACKGROUND:
${JSON.stringify(body.candidate, null, 2)}

AVAILABLE PROJECT STORIES (summaries):
${relevantStories.map((story, index) => `
Story ${index + 1}: ${story.title} [Relevance: ${Math.round((story.relevance || 0) * 100)}%]
Category: ${story.category}
${story.metrics?.impact ? `Impact: ${story.metrics.impact}` : ''}
Technologies: ${story.tags.slice(0, 6).join(', ')}${story.tags.length > 6 ? '...' : ''}
Brief: ${story.content.substring(0, 150).replace(/\n/g, ' ')}...
`).join('\n\n')}

Decide: Are any of these stories worth including, or should I focus on CV experience and job requirements instead?`
    }
  ];

  // STEP 1: Get AI's story selection
  const { zodResponseFormat } = await import('openai/helpers/zod');

  const storySelectionResponse = await openai.chat.completions.parse({
    model: OPENAI_MODELS.LATEST_MINI,
    messages: storySelectionMessages,
    response_format: zodResponseFormat(StorySelectionSchema, 'story_selection')
  });

  const storySelection = storySelectionResponse.choices[0].message.parsed;
  if (!storySelection) {
    throw new Error('Failed to get story selection from AI');
  }

  // Convert to 0-indexed and validate
  const requestedStories: number[] = storySelection.useStories
    ? storySelection.selectedStoryIds
        .filter((id: number) => id >= 1 && id <= relevantStories.length)
        .map((id: number) => id - 1)
    : [];

  // STEP 2: Generate letter (with or without stories)
  const letterGenerationMessages = [
    {
      role: 'system' as const,
      content: `Write an authentic, conversational motivational letter. Focus on storytelling and genuine human connection rather than corporate sales language. Make it sound like the candidate is having a thoughtful conversation about their work experience.`
    },
    {
      role: 'user' as const,
      content: `Write a motivational letter for this position.

JOB POSTING:
${body.jobDescription}

CANDIDATE BACKGROUND:
${JSON.stringify(body.candidate, null, 2)}

STRENGTHS TO HIGHLIGHT:
${body.strongPoints?.length > 0 ? body.strongPoints.join(', ') : 'Whatever fits best with the job'}

${requestedStories.length > 0 ? `DETAILED PROJECT STORIES:
${requestedStories.map((storyIndex, i) => {
  const story = relevantStories[storyIndex];
  const settings = getSettings();
  return `
Story ${i + 1}: ${story.title}
Category: ${story.category}
${story.metrics?.impact ? `Impact: ${story.metrics.impact}` : ''}
${story.metrics?.timeframe ? `Timeline: ${story.metrics.timeframe}` : ''}
${story.metrics?.usersAffected ? `Users affected: ${story.metrics.usersAffected}` : ''}
Technologies: ${story.tags.join(', ')}
Full story URL: ${settings.siteUrl}${PROJECT_STORIES_PATH}/${story.id}

Full story: ${story.content}
`;
}).join('\n\n')}` : 'NOTE: Focus on CV experience and job requirements - no specific project stories were deemed relevant enough to include.'}

WRITING STYLE & STRUCTURE:
Write conversationally but professionally - like explaining to a colleague over coffee.

Format:
1. "Dear [Company] Team," + what caught your eye about this specific role
2. ONE relevant story: problem → solution → result (break complex stories into 2-3 paragraphs)
3. Brief skills/experience summary (separate paragraph)
4. Closing question about their current work
5. Professional signature: enthusiasm statement + "Best regards," + "${body.candidate.name}"

Guidelines:
- Keep sentences short and direct: "I built X. It did Y. Result was Z."
- Break technical stories into logical chunks for readability
- Include company-specific details to show research
- Avoid corporate buzzwords and trying to sound impressive
- When mentioning project stories, include links like: "I built a calculator (full story: https://example.com) that..."

Example ending:
"If you're open to a chat, I'd love to hear about [specific question].

I'm excited about the opportunity to contribute to [company] and help [value].

Best regards,
[Full Name]"

Keep it 300-350 words max. Be clear and authentic, not clever.`
    }
  ];

  // Generate the motivational letter
  const response = await openai.chat.completions.create({
    model: OPENAI_MODELS.LATEST_MINI,
    messages: letterGenerationMessages,
  });

  const letterContent = response.choices[0].message.content;

  if (letterContent) {
    // Clean up em dashes and fix spacing around commas
    const cleanedLetter = letterContent.replace(/\s*—\s*/g, ', ');

    return {
      letter: cleanedLetter,
      selectedStories: requestedStories.length > 0 ? requestedStories.map(storyIndex => {
        const story = relevantStories[storyIndex];
        return {
          id: story.id,
          title: story.title,
          category: story.category,
          relevance: story.relevance || 0,
          tags: story.tags,
          metrics: story.metrics,
          url: `${PROJECT_STORIES_PATH}/${story.id}`,
          fullUrl: `${settings.siteUrl}${PROJECT_STORIES_PATH}/${story.id}`
        };
      }) : [],
      selectionReasoning: storySelection.reasoning
    };
  }

  throw new Error('Failed to generate motivational letter');
}

export const POST = withAuth(handleMotivationalLetter);
