import { z } from 'zod'
import { getOpenAIClient, OPENAI_MODELS } from '@/lib/openai-service'
import { withAuth, createErrorResponse } from '@/lib/api-middleware'
import { withCacheStatus, generateCacheKey } from '@/lib/cache-server'
import { CACHE_CONFIG } from '@/lib/cache-config'
import { findRelevantStories } from '@/lib/project-stories'
import { PROJECT_STORIES_PATH } from '@/lib/routes'
import { getSettings } from '@/data/settings'

export const runtime = 'nodejs';

// Input schema
const StoryRankingRequestSchema = z.object({
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
  maxStories: z.number().optional().default(5)
});

// Schema for story selection response
const StorySelectionSchema = z.object({
  selectedStoryIds: z.array(z.number()).describe("Array of story numbers (1-based) that would be most relevant for this role. Can be empty if no stories are particularly relevant."),
  reasoning: z.string().describe("Brief explanation of why these stories were chosen, or why none were selected"),
  useStories: z.boolean().describe("Whether any stories should be included - true only if they add significant value")
});

async function handleStoryRanking(req: Request): Promise<Response> {
  try {
    const body = await req.json()
    const validatedBody = StoryRankingRequestSchema.parse(body)

    // Generate cache key from request parameters
    const cacheKey = generateCacheKey('story-ranking', validatedBody)

    // Try to get cached response
    const { data: result, fromCache } = await withCacheStatus(
      cacheKey,
      async () => {
        return await rankStories(validatedBody)
      },
      CACHE_CONFIG.MOTIVATIONAL_LETTER // Use motivational letter cache config
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

async function rankStories(body: { jobDescription: string; maxStories: number }) {
  const openai = getOpenAIClient();
  const settings = getSettings();

  // Get relevant stories for this job
  const relevantStories = await findRelevantStories(body.jobDescription, 8); // Get more for AI to choose from

  // STEP 1: Present story summaries and ask which ones to select
  const storySelectionMessages = [
    {
      role: 'system' as const,
      content: `You are helping select the most relevant project stories for a job application. Review the job and available project stories, then decide which stories would be most valuable to highlight. Only include stories if they directly address challenges mentioned in the job posting or demonstrate highly relevant skills. Quality over quantity - better to have 2-3 perfect matches than 5 loosely related ones.`
    },
    {
      role: 'user' as const,
      content: `Which project stories should be highlighted for this job?

JOB POSTING:
${body.jobDescription}

AVAILABLE PROJECT STORIES (summaries):
${relevantStories.map((story, index) => `
Story ${index + 1}: ${story.title} [Relevance: ${Math.round((story.relevance || 0) * 100)}%]
Category: ${story.category}
${story.metrics?.impact ? `Impact: ${story.metrics.impact}` : ''}
Technologies: ${story.tags.slice(0, 6).join(', ')}${story.tags.length > 6 ? '...' : ''}
Brief: ${story.content.substring(0, 150).replace(/\n/g, ' ')}...
`).join('\n\n')}

Select the most relevant stories (up to ${body.maxStories}) that would strengthen this job application.`
    }
  ];

  // Get AI's story selection
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

  // Return ranked stories with full details
  const rankedStories = requestedStories.slice(0, body.maxStories).map((storyIndex) => {
    const story = relevantStories[storyIndex];
    return {
      id: story.id,
      title: story.title,
      category: story.category,
      relevance: story.relevance || 0,
      tags: story.tags,
      metrics: story.metrics,
      url: `${PROJECT_STORIES_PATH}/${story.id}`,
      fullUrl: `${settings.siteUrl}${PROJECT_STORIES_PATH}/${story.id}`,
      content: story.content
    };
  });

  return {
    selectedStories: rankedStories,
    selectionReasoning: storySelection.reasoning,
    useStories: storySelection.useStories,
    totalAvailable: relevantStories.length
  };
}

export const POST = withAuth(handleStoryRanking);