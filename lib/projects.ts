import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Link, Project } from '@/types';

export type ProjectMetricMap = {
  impact?: string | { en: string; da?: string; sv?: string };
  timeframe?: string;
  usersAffected?: string;
};

export type ProjectDocument = Project & {
  content: string;
  locale: string;
  category?: string;
  date?: string;
  metrics?: ProjectMetricMap;
  liveUrl?: string;
  sourceUrl?: string;
};

function getLocaleDir(locale: string): string {
  if (locale === 'da') return 'data/projects-da';
  if (locale === 'sv') return 'data/projects-sv';
  return 'data/projects';
}

function readProjectFile(filePath: string, locale: string): ProjectDocument | null {
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);

  return {
    title: frontmatter.title || 'Untitled',
    slug: frontmatter.slug || path.basename(filePath, '.md'),
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
    content,
    locale,
  };
}

export function getProjectBySlug(locale: string, slug: string): ProjectDocument | null {
  const localizedPath = path.join(process.cwd(), getLocaleDir(locale), `${slug}.md`);
  const fallbackPath = path.join(process.cwd(), "data/projects", `${slug}.md`);
  return readProjectFile(localizedPath, locale) || readProjectFile(fallbackPath, 'en');
}

export function getAllProjects(locale: string): ProjectDocument[] {
  const localizedDir = path.join(process.cwd(), getLocaleDir(locale));
  const fallbackDir = path.join(process.cwd(), 'data/projects');

  const localizedFiles = fs.existsSync(localizedDir)
    ? fs.readdirSync(localizedDir).filter((file) => file.endsWith('.md'))
    : [];
  const fallbackFiles = fs.existsSync(fallbackDir)
    ? fs.readdirSync(fallbackDir).filter((file) => file.endsWith('.md'))
    : [];

  const allFiles = Array.from(new Set([...localizedFiles, ...fallbackFiles]));

  return allFiles
    .map((file) => {
      const localizedPath = path.join(localizedDir, file);
      const fallbackPath = path.join(fallbackDir, file);
      return readProjectFile(localizedPath, locale) || readProjectFile(fallbackPath, 'en');
    })
    .filter((project): project is ProjectDocument => Boolean(project))
    .filter((project) => !project.archived)
    .sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title);
    });
}

export function getListedProjects(locale: string): ProjectDocument[] {
  return getAllProjects(locale).filter((project) => project.listed !== false);
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
