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
      content: `Write an authentic, conversational motivational letter. Focus on storytelling and genuine human connection rather than corporate sales language. Make it sound like the candidate is having a thoughtful conversation about their work experience.

CRITICAL ACCURACY REQUIREMENT: When referencing project stories, you MUST be completely accurate. Only mention technical details that are explicitly stated in the provided story content. Do not infer, embellish, or add plausible-sounding technical details that aren't actually in the source material. If the story says "SQL optimization", don't add specifics about indexes, DTOs, or cursors unless those exact terms appear in the story.`
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
  
  // Extract key facts from the story for accurate summarization
  const storyLines = story.content.split('\n');
  const keyFacts = storyLines
    .filter(line => line.trim().length > 0 && !line.startsWith('#'))
    .slice(0, 10)  // First 10 non-header lines usually contain the key facts
    .join('\n');
  
  return `
Story ${i + 1}: ${story.title}
Category: ${story.category}
${story.metrics?.impact ? `Impact: ${story.metrics.impact}` : ''}
${story.metrics?.timeframe ? `Timeline: ${story.metrics.timeframe}` : ''}
${story.metrics?.usersAffected ? `Users affected: ${story.metrics.usersAffected}` : ''}
Technologies: ${story.tags.join(', ')}
Full story URL: ${settings.siteUrl}${PROJECT_STORIES_PATH}/${story.id}

KEY FACTS TO USE (only mention these specific details):
${keyFacts}

FULL STORY FOR CONTEXT (DO NOT add details from here that aren't in the key facts above):
${story.content}
`;
}).join('\n\n')}` : 'NOTE: Focus on CV experience and job requirements - no specific project stories were deemed relevant enough to include.'}

WRITING STYLE & STRUCTURE:
Write conversationally - like you're explaining your experience to a colleague. Each section should flow naturally into the next.

Format with smooth transitions:
1. Opening (2-3 sentences): "Dear [Company] Team," + what specific problem they're solving that interests you
2. Story setup (2-3 sentences): Bridge from their problem to your similar experience
3. Story details (2-3 SHORT paragraphs, 2-3 sentences each): Problem → Action → Result
4. Skills bridge (1-2 sentences): Link the story lesson to your broader experience
5. Closing (2-3 sentences): Specific question + enthusiasm

PARAGRAPH RULES:
- Maximum 3 sentences per paragraph
- Each paragraph = one clear idea
- Use single-sentence paragraphs for impact
- Break at natural pauses where someone would breathe

TRANSITION EXAMPLES:
- Opening → Story: "I've worked on similar problems at..."
- Story → Skills: "This kind of work is what I do best..."  
- Skills → Closing: "I'd love to bring this experience to..."

Guidelines:
- Short, punchy sentences (max 15 words when possible)
- Start new paragraph after every 2-3 sentences
- Use linking phrases: "That's why...", "This taught me...", "Which is why..."
- When mentioning project stories, include link: "(full story: URL)"
- CRITICAL: Only use technical details EXPLICITLY in the provided story
- NO fabricated details (no "DTOs", "cursors", etc unless in source)
- Use simple, everyday words: say "worked on" not "tackled", "fixed" not "remediated", "built" not "architected"
- Avoid corporate buzzwords and fancy vocabulary - write like you're talking to a friend

Example rhythm:
"Your challenge with X caught my attention. I've solved similar problems.

At Company, we had [problem]. Users were [impact].

I discovered [root cause]. So I [action].

The result: [outcome].

This kind of [type] work is what I do best. I've spent X years [relevant experience].

I'd love to hear about [specific question]. [Enthusiasm statement].

Best regards,
[Name]"

Target: 250-300 words. Readable in 45 seconds.`
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
