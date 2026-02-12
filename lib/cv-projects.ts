import { getSettings } from '@/data/settings';
import { PROJECT_STORIES_PATH } from './routes';

interface CVProject {
  iconName: string;
  text: string;
  url?: string;
}

export interface CVProjectsSection {
  id: string;
  title: string;
  bulletPoints: CVProject[];
}

interface RankedStory {
  id: string;
  title: string;
  category: string;
  relevance: number;
  tags: string[];
  metrics?: {
    impact?: string | {
      en: string;
      da?: string;
      sv?: string;
    };
    timeframe?: string;
    usersAffected?: string;
  };
  url: string;
  fullUrl: string;
  content: string;
}

/**
 * Get localized impact text from a story
 */
function getLocalizedImpact(impact: string | { en: string; da?: string; sv?: string } | undefined, locale: string): string {
  if (!impact) return '';

  // If impact is an object with translations
  if (typeof impact === 'object') {
    return impact[locale as keyof typeof impact] || impact.en;
  }

  // If impact is just a string, return it as-is
  return impact;
}

/**
 * Convert ranked stories to CV projects format with translations
 */
function convertStoriesToCVProjects(rankedStories: RankedStory[], locale: string): CVProject[] {
  return rankedStories.map(story => {
    // Get localized impact description
    const impact = story.metrics?.impact || story.title;
    const description = getLocalizedImpact(impact, locale);

    // Select icon based on category
    let iconName = "science"; // default
    if (story.category === 'automation') {
      iconName = "gitHub";
    } else if (story.id === 'magic-bookmarks') {
      iconName = "translate";
    }

    return {
      iconName,
      text: description,
      url: story.fullUrl
    };
  });
}


/**
 * Get projects section using AI-ranked stories for a specific job
 */
export async function getCVProjectsSectionForJob(jobDescription: string, locale: string = 'en'): Promise<CVProjectsSection> {
  try {
    const response = await fetch('/api/stories/rank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobDescription,
        maxStories: 4 // Limit to 4 for CV
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to rank stories');
    }

    const result = await response.json();
    const bulletPoints = convertStoriesToCVProjects(result.selectedStories, locale);

    return {
      id: "personal-projects",
      title: getProjectsTitleByLocale(locale),
      bulletPoints
    };
  } catch (error) {
    console.error('Error getting ranked stories for CV, falling back to default:', error);
    return await getCVProjectsSection(locale);
  }
}

/**
 * Get default projects section (fallback when no job description available)
 * This function should only be called server-side (in API routes or SSR)
 */
export async function getCVProjectsSection(locale: string = 'en'): Promise<CVProjectsSection> {
  // Import here to avoid circular dependency issues
  const { getAllStories } = await import('./project-stories');
  const stories = await getAllStories();
  const settings = getSettings();

  // Simple fallback: get technical stories (exclude business category)
  const cvRelevantStories = stories
    .filter(story => story.category !== 'business')
    .sort((a, b) => {
      // Prioritize stories with impact metrics
      if (a.metrics?.impact && !b.metrics?.impact) return -1;
      if (!a.metrics?.impact && b.metrics?.impact) return 1;
      // Then by title alphabetically
      return a.title.localeCompare(b.title);
    })
    .slice(0, 5); // Limit to 5 projects for CV

  const bulletPoints: CVProject[] = cvRelevantStories.map(story => {
    // Get localized impact description
    const impact = story.metrics?.impact || story.title;
    const description = getLocalizedImpact(impact, locale);

    // Select icon based on category
    let iconName = "science"; // default
    if (story.category === 'automation') {
      iconName = "gitHub";
    } else if (story.id === 'magic-bookmarks') {
      iconName = "translate";
    }

    return {
      iconName,
      text: description,
      url: `${settings.siteUrl}${PROJECT_STORIES_PATH}/${story.id}`
    };
  });

  return {
    id: "personal-projects",
    title: getProjectsTitleByLocale(locale),
    bulletPoints
  };
}

/**
 * Get projects title by locale
 */
function getProjectsTitleByLocale(locale: string): string {
  switch (locale) {
    case 'da':
      return 'Arbejdseksempler';
    case 'sv':
      return 'Arbetsexempel';
    case 'en':
    default:
      return 'Work Examples';
  }
}