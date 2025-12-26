import { getSettings } from '@/data/settings';
import { PROJECT_STORIES_PATH } from './routes';
import { CvSection } from '@/types';

interface CVProject {
  iconName: string;
  text: string;
  url?: string;
  description?: string;
}

interface RankedStory {
  id: string;
  title: string;
  category: string;
  relevance: number;
  tags: string[];
  metrics?: {
    impact?: string;
    timeframe?: string;
    usersAffected?: string;
  };
  url: string;
  fullUrl: string;
  content: string;
}

/**
 * Convert ranked stories to CV projects format with translations
 */
function convertStoriesToCVProjects(rankedStories: RankedStory[], locale: string): CVProject[] {
  return rankedStories.map(story => {
    // Create a concise description with just the impact metric
    const impact = story.metrics?.impact || story.title;
    const description = translateImpact(impact, locale);

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
 * Translate project title based on locale (basic mapping for common titles)
 */
function translateProjectTitle(title: string, locale: string): string {
  if (locale === 'en') return title;

  const translations: Record<string, Record<string, string>> = {
    'da': {
      'Real-Time Property Investment Calculator': 'Real-Time Ejendomsinvestering Beregner',
      'Git-to-Jira Bridge': 'Git-til-Jira Bridge',
      'AI Job Application Platform': 'AI Job Ansøgning Platform',
      'Playwright Job Scraper': 'Playwright Job Scraper',
      'Ankerimdia Startup': 'Ankerimdia Startup',
      '10x Performance Improvement': '10x Ydeevne Forbedring'
    },
    'sv': {
      'Real-Time Property Investment Calculator': 'Real-Time Fastighetsinvestering Kalkylator',
      'Git-to-Jira Bridge': 'Git-till-Jira Bridge',
      'AI Job Application Platform': 'AI Jobbansökan Plattform',
      'Playwright Job Scraper': 'Playwright Job Scraper',
      'Ankerimdia Startup': 'Ankerimdia Startup',
      '10x Performance Improvement': '10x Prestanda Förbättring'
    }
  };

  return translations[locale]?.[title] || title;
}

/**
 * Translate impact descriptions based on locale
 */
function translateImpact(impact: string, locale: string): string {
  if (locale === 'en') return impact;

  // Basic translations for common impact phrases
  const translations: Record<string, Record<string, string>> = {
    'da': {
      'Interactive buy vs rent calculator with real-time financial projections': 'Interaktiv beregner til sammenligning af køb og leje',
      'Automated time tracking by syncing Git commits to Jira': 'Automatiseret tidssporing via Git og Jira',
      'Reduced sync time from 20+ minutes to minutes': 'Accelererede app-synkronisering fra 20+ min til få minutter',
      'Apply for 10 jobs in 30 minutes vs hours manually': 'AI-værktøj der reducerer ansøgningstid med 80%',
      'Filtered 30 jobs/minute, prioritized fresh opportunities': 'Automatisk scraping og filtrering af LinkedIn job',
      'Streamlines navigation across development environments': 'Genveje til at skifte mellem test- og produktionsmiljøer'
    },
    'sv': {
      'Interactive buy vs rent calculator with real-time financial projections': 'Interaktiv kalkylator för köp- och hyraanalys',
      'Automated time tracking by syncing Git commits to Jira': 'Automatiserad tidsspårning via Git och Jira',
      'Reduced sync time from 20+ minutes to minutes': 'Accelererade appsynkronisering från 20+ min till några minuter',
      'Apply for 10 jobs in 30 minutes vs hours manually': 'AI-verktyg som minskar ansökningstid med 80%',
      'Filtered 30 jobs/minute, prioritized fresh opportunities': 'Automatisk skrapning och filtrering av LinkedIn-jobb',
      'Streamlines navigation across development environments': 'Genvägar för att växla mellan test- och produktionsmiljöer'
    }
  };

  // Try to find exact match first
  const exactMatch = translations[locale]?.[impact];
  if (exactMatch) return exactMatch;

  // Basic keyword replacements for partial matches
  let translatedImpact = impact;

  if (locale === 'da') {
    translatedImpact = translatedImpact
      .replace(/users/gi, 'brugere')
      .replace(/helps/gi, 'hjælper')
      .replace(/performance/gi, 'ydeevne')
      .replace(/improved/gi, 'forbedrede');
  } else if (locale === 'sv') {
    translatedImpact = translatedImpact
      .replace(/users/gi, 'användare')
      .replace(/helps/gi, 'hjälper')
      .replace(/performance/gi, 'prestanda')
      .replace(/improved/gi, 'förbättrade');
  }

  return translatedImpact;
}

/**
 * Get projects section using AI-ranked stories for a specific job
 */
export async function getCVProjectsSectionForJob(jobDescription: string, locale: string = 'en'): Promise<CvSection> {
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
      subtitles: null,
      paragraphs: null,
      bulletPoints: bulletPoints.map((bp, index) => ({
        id: `project-${index}`,
        iconName: bp.iconName,
        text: bp.text,
        url: bp.url || null,
        description: bp.description || null,
      })),
      subSections: null,
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
export async function getCVProjectsSection(locale: string = 'en'): Promise<CvSection> {
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
    // Create a concise description with just the impact metric
    const impact = story.metrics?.impact || story.title;
    const description = translateImpact(impact, locale);

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
    subtitles: null,
    paragraphs: null,
    bulletPoints: bulletPoints.map((bp, index) => ({
      id: `project-${index}`,
      iconName: bp.iconName,
      text: bp.text,
      url: bp.url || null,
      description: bp.description || null,
    })),
    subSections: null,
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