import fs from 'fs';
import path from 'path';
import { cache, type ComponentType } from 'react';
import { Link, Project } from '@/types';

export type ProjectMetricMap = {
  impact?: string | { en: string; da?: string; sv?: string };
  timeframe?: string;
  usersAffected?: string;
};

export type ProjectDocument = Project & {
  content: string;
  locale: string;
  Content: ComponentType;
  category?: string;
  date?: string;
  metrics?: ProjectMetricMap;
  liveUrl?: string;
  sourceUrl?: string;
  cvTitle?: string;
  cvDescription?: string;
  embedding?: number[];
};

type ProjectFrontmatter = Omit<ProjectDocument, 'content' | 'locale' | 'Content'>;

type ProjectMdxModule = {
  default: ComponentType;
  metadata?: ProjectFrontmatter;
};

type SupportedLocale = 'en' | 'da' | 'sv';

const legacyStorySlugMap: Record<string, string> = {
  'git-to-jira-bridge': 'git-jira-bridge',
};

function normalizeLocale(locale: string): SupportedLocale {
  if (locale === 'da' || locale === 'sv') return locale;
  return 'en';
}

function getLocaleDir(locale: SupportedLocale): string {
  if (locale === 'da') return 'data/projects-da';
  if (locale === 'sv') return 'data/projects-sv';
  return 'data/projects';
}

function readMdxBody(filePath: string): string {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return fileContent.replace(/^export const metadata = [\s\S]*?;\n\n/, '').trim();
}

async function importLocalizedProjectModule(locale: SupportedLocale, slug: string): Promise<ProjectMdxModule> {
  switch (locale) {
    case 'da':
      return import(`../data/projects-da/${slug}.mdx`) as Promise<ProjectMdxModule>;
    case 'sv':
      return import(`../data/projects-sv/${slug}.mdx`) as Promise<ProjectMdxModule>;
    case 'en':
    default:
      return import(`../data/projects/${slug}.mdx`) as Promise<ProjectMdxModule>;
  }
}

async function importLegacyProjectModule(slug: string): Promise<ProjectMdxModule> {
  return import(`../project-stories/${slug}.mdx`) as Promise<ProjectMdxModule>;
}

async function readProjectFile(
  filePath: string,
  importer: () => Promise<ProjectMdxModule>,
  locale: SupportedLocale,
): Promise<ProjectDocument | null> {
  if (!fs.existsSync(filePath)) return null;

  const mdxModule = await importer();
  const frontmatter = (mdxModule.metadata || {}) as ProjectFrontmatter;

  return {
    title: frontmatter.title || 'Untitled',
    slug: frontmatter.slug || path.basename(filePath, '.mdx'),
    image: frontmatter.image || '',
    imageAlt: frontmatter.imageAlt,
    tags: frontmatter.tags || frontmatter.tech || [],
    tech: frontmatter.tech,
    links: frontmatter.links || [],
    featured: frontmatter.featured || false,
    archived: frontmatter.archived || false,
    listed: frontmatter.listed !== false,
    description: frontmatter.description,
    order: frontmatter.order,
    category: frontmatter.category,
    date: frontmatter.date,
    metrics: frontmatter.metrics,
    liveUrl: frontmatter.liveUrl,
    sourceUrl: frontmatter.sourceUrl,
    cvTitle: frontmatter.cvTitle,
    cvDescription: frontmatter.cvDescription,
    embedding: frontmatter.embedding,
    content: readMdxBody(filePath),
    Content: mdxModule.default,
    locale,
  };
}

async function getLegacyStory(slug: string, locale: SupportedLocale): Promise<ProjectDocument | null> {
  const legacySlug = legacyStorySlugMap[slug] || slug;
  const legacyPath = path.join(process.cwd(), 'project-stories', `${legacySlug}.mdx`);
  return readProjectFile(legacyPath, () => importLegacyProjectModule(legacySlug), locale);
}

function shouldUseLegacyContent(project: ProjectDocument | null, legacyProject: ProjectDocument | null): boolean {
  if (!legacyProject) return false;
  if (!project) return true;

  const trimmed = project.content.trim();
  const lineCount = trimmed ? trimmed.split(/\n+/).length : 0;
  return trimmed.length < 900 || lineCount < 18;
}

function mergeProjectWithLegacy(project: ProjectDocument | null, legacyProject: ProjectDocument | null): ProjectDocument | null {
  if (!project && !legacyProject) return null;
  if (!project) return legacyProject;
  if (!legacyProject) return project;
  if (!shouldUseLegacyContent(project, legacyProject)) return project;

  return {
    ...project,
    content: legacyProject.content,
    Content: legacyProject.Content,
    category: project.category || legacyProject.category,
    date: project.date || legacyProject.date,
    metrics: project.metrics || legacyProject.metrics,
    liveUrl: project.liveUrl || legacyProject.liveUrl,
    sourceUrl: project.sourceUrl || legacyProject.sourceUrl,
    embedding: project.embedding || legacyProject.embedding,
    tags: project.tags?.length ? project.tags : legacyProject.tags,
  };
}

export const getProjectBySlug = cache(async (locale: string, slug: string): Promise<ProjectDocument | null> => {
  const normalizedLocale = normalizeLocale(locale);
  const localizedPath = path.join(process.cwd(), getLocaleDir(normalizedLocale), `${slug}.mdx`);
  const fallbackPath = path.join(process.cwd(), 'data/projects', `${slug}.mdx`);

  const project =
    await readProjectFile(localizedPath, () => importLocalizedProjectModule(normalizedLocale, slug), normalizedLocale) ||
    (normalizedLocale === 'en'
      ? null
      : await readProjectFile(fallbackPath, () => importLocalizedProjectModule('en', slug), 'en'));

  const legacyProject = await getLegacyStory(slug, normalizedLocale);
  return mergeProjectWithLegacy(project, legacyProject);
});

export const getAllProjects = cache(async (locale: string): Promise<ProjectDocument[]> => {
  const normalizedLocale = normalizeLocale(locale);
  const localizedDir = path.join(process.cwd(), getLocaleDir(normalizedLocale));
  const fallbackDir = path.join(process.cwd(), 'data/projects');

  const localizedFiles = fs.existsSync(localizedDir)
    ? fs.readdirSync(localizedDir).filter((file) => file.endsWith('.mdx'))
    : [];
  const fallbackFiles = fs.existsSync(fallbackDir)
    ? fs.readdirSync(fallbackDir).filter((file) => file.endsWith('.mdx'))
    : [];

  const slugs = Array.from(new Set([...localizedFiles, ...fallbackFiles]))
    .map((file) => file.replace(/\.mdx$/, ''));

  const projects = await Promise.all(slugs.map((entrySlug) => getProjectBySlug(normalizedLocale, entrySlug)));

  return projects
    .filter((project): project is ProjectDocument => Boolean(project))
    .filter((project) => !project.archived)
    .sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title);
    });
});

export async function getListedProjects(locale: string): Promise<ProjectDocument[]> {
  return (await getAllProjects(locale)).filter((project) => project.listed !== false);
}

export function getProjectActionLinks(project: ProjectDocument): Link[] {
  const links = [...(project.links || [])];

  if (project.liveUrl && !links.some((link) => link.url === project.liveUrl)) {
    links.unshift({ title: 'Live Demo', url: project.liveUrl, iconName: 'externalLink' });
  }

  if (project.sourceUrl && !links.some((link) => link.url === project.sourceUrl)) {
    links.push({ title: 'Source', url: project.sourceUrl, iconName: 'gitHub' });
  }

  return links;
}
