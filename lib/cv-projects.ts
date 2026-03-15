import { getSettings } from '@/data/settings';
import { CvSection } from '@/types';

export interface CuratedProject {
  iconName: string;
  text: string;
  url?: string;
  description?: string;
}

type Locale = 'en' | 'da' | 'sv';

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

export function getCuratedProjects(locale: Locale): CuratedProject[] {
  const localized: Record<Locale, CuratedProject[]> = {
    en: [
      {
        iconName: 'speed',
        text: '10x Performance Improvement',
        description: 'Optimized enterprise sync from 20+ min to 2 min for 1000+ technicians.',
        url: `/${locale}/project-stories/10x-performance-improvement`,
      },
      {
        iconName: 'schedule',
        text: 'Git-to-JIRA Time Tracker',
        description: 'Automated time logging from commits with Jira sync and review flow.',
        url: 'https://log-bridge.vercel.app',
      },
      {
        iconName: 'dashboard',
        text: 'Developer Task Overview Dashboard',
        description: 'Combines Jira and GitHub into one view for active tasks, PRs, checks, and follow-up.',
        url: `/${locale}/project-stories/git-jira-bridge`,
      },
      {
        iconName: 'psychology',
        text: 'AI Job Application Platform',
        description: 'Next.js platform for CV customization, cover letters, and multilingual flows.',
        url: `/${locale}/project-stories/ai-job-application-platform`,
      },
    ],
    da: [
      {
        iconName: 'speed',
        text: '10x Præstationsforbedring',
        description: 'Reducerede synkroniseringstid fra 20+ min til få minutter i et produktionssystem.',
        url: `/${locale}/project-stories/10x-performance-improvement`,
      },
      {
        iconName: 'schedule',
        text: 'Git-til-Jira Bro',
        description: 'Automatiseret tidssporing fra commits med Jira-sync og review-flow.',
        url: `/${locale}/project-stories/git-jira-bridge`,
      },
      {
        iconName: 'dashboard',
        text: 'Udviklerdashboard',
        description: "Samler Jira og GitHub i ét overblik for aktive opgaver, PR'er, checks og opfølgning.",
        url: `/${locale}/project-stories/git-jira-bridge`,
      },
      {
        iconName: 'psychology',
        text: 'AI-drevet jobansøgningsplatform',
        description: 'Next.js-platform til CV-tilpasning, cover letters og flersprogede flows.',
        url: `/${locale}/project-stories/ai-job-application-platform`,
      },
    ],
    sv: [
      {
        iconName: 'speed',
        text: '10x Prestandaförbättring',
        description: 'Minskade synkroniseringstid från 20+ min till några minuter i ett produktionssystem.',
        url: `/${locale}/project-stories/10x-performance-improvement`,
      },
      {
        iconName: 'schedule',
        text: 'Git-till-Jira Bro',
        description: 'Automatiserad tidsspårning från commits med Jira-sync och reviewflöde.',
        url: `/${locale}/project-stories/git-jira-bridge`,
      },
      {
        iconName: 'dashboard',
        text: 'Utvecklardashboard',
        description: 'Samlar Jira och GitHub i en vy för aktiva uppgifter, PR:er, checks och uppföljning.',
        url: `/${locale}/project-stories/git-jira-bridge`,
      },
      {
        iconName: 'psychology',
        text: 'AI-driven jobbansökningsplattform',
        description: 'Next.js-plattform för CV-anpassning, cover letters och flerspråkiga flöden.',
        url: `/${locale}/project-stories/ai-job-application-platform`,
      },
    ],
  };

  return localized[locale];
}

function toSection(projects: CuratedProject[], locale: string): CvSection {
  return {
    id: 'personal-projects',
    title: getProjectsTitleByLocale(locale),
    subtitles: null,
    paragraphs: null,
    bulletPoints: projects.map((project, index) => ({
      id: `project-${index}`,
      iconName: project.iconName,
      text: project.text,
      url: project.url || null,
      description: project.description || null,
    })),
    subSections: null,
  };
}

export async function getCVProjectsSectionForJob(_jobDescription: string, locale: string = 'en'): Promise<CvSection> {
  return getCVProjectsSection(locale);
}

export async function getCVProjectsSection(locale: string = 'en'): Promise<CvSection> {
  const validLocale: Locale = locale === 'da' || locale === 'sv' ? locale : 'en';
  const projects = getCuratedProjects(validLocale);
  return toSection(projects, validLocale);
}
