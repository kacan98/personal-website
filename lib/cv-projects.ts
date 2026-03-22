import { getProjectBySlug } from "@/lib/projects";
import { CvSection } from "@/types";

export interface CuratedProject {
  iconName: string;
  text: string;
  url?: string;
  description?: string;
}

type Locale = "en" | "da" | "sv";

type CuratedProjectRef = {
  slug: string;
  iconName: string;
  titleOverride?: string;
};

type ProjectDisplayData = {
  title: string;
  description: string | null;
  url: string;
  iconName: string;
};

const curatedProjects: CuratedProjectRef[] = [
  { slug: "10x-performance-improvement", iconName: "speed" },
  { slug: "git-to-jira-bridge", iconName: "schedule" },
  { slug: "developer-task-overview-dashboard", iconName: "dashboard" },
  { slug: "ai-job-application-platform", iconName: "psychology", titleOverride: "AI Job Application Platform" },
];

function getProjectsTitleByLocale(locale: string): string {
  switch (locale) {
    case "da":
      return "Arbejdseksempler";
    case "sv":
      return "Arbetsexempel";
    case "en":
    default:
      return "Work Examples";
  }
}

async function getProjectDisplayData(locale: Locale, projectRef: CuratedProjectRef): Promise<ProjectDisplayData> {
  const project = await getProjectBySlug(locale, projectRef.slug) || await getProjectBySlug("en", projectRef.slug);

  if (!project) {
    return {
      title: projectRef.titleOverride || projectRef.slug,
      description: null,
      url: `/${locale}/projects/${projectRef.slug}`,
      iconName: projectRef.iconName,
    };
  }

  const projectWithCvFields = project as typeof project & {
    cvTitle?: string;
    cvDescription?: string;
  };

  return {
    title: projectRef.titleOverride || projectWithCvFields.cvTitle || project.title,
    description: projectWithCvFields.cvDescription || project.description || null,
    url: `/${locale}/projects/${project.slug}`,
    iconName: projectRef.iconName,
  };
}

export async function getCuratedProjects(locale: Locale): Promise<CuratedProject[]> {
  const projects = await Promise.all(curatedProjects.map((projectRef) => getProjectDisplayData(locale, projectRef)));
  return projects.map((project) => ({
    iconName: project.iconName,
    text: project.title,
    description: project.description || undefined,
    url: project.url,
  }));
}

function toSection(projects: ProjectDisplayData[], locale: string): CvSection {
  return {
    id: "personal-projects",
    title: getProjectsTitleByLocale(locale),
    subtitles: null,
    paragraphs: null,
    bulletPoints: projects.map((project, index) => ({
      id: `project-${index}`,
      iconName: project.iconName,
      text: project.title,
      url: project.url,
      description: project.description,
    })),
    subSections: null,
  };
}

export async function getCVProjectsSectionForJob(_jobDescription: string, locale: string = "en"): Promise<CvSection> {
  return getCVProjectsSection(locale);
}

export async function getCVProjectsSection(locale: string = "en"): Promise<CvSection> {
  const validLocale: Locale = locale === "da" || locale === "sv" ? locale : "en";
  const projects = await Promise.all(curatedProjects.map((projectRef) => getProjectDisplayData(validLocale, projectRef)));
  return toSection(projects, validLocale);
}
