import React from "react";
import ProjectDisplay from "@/components/pages/portfolio/projects/projectDisplay";
import PageWrapper from "@/components/pages/pageWrapper";
import { readMarkdownFiles } from "@/lib/markdown";
import { Project } from "@/types";

interface PortfolioPageProps {
  title: string;
  locale: string;
}

async function PortfolioPage({ title, locale }: PortfolioPageProps) {
  const projectsFolder = locale === 'da' ? 'data/projects-da' : 'data/projects';
  const projects = readMarkdownFiles<Project>(projectsFolder);

  return (
    <PageWrapper title={title}>
      <ProjectDisplay
        projects={projects.sort((a: Project, b: Project) => a.title.localeCompare(b.title))}
      />
    </PageWrapper>
  );
}

export default PortfolioPage;
