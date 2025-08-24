import React from "react";
import ProjectDisplay from "@/components/pages/portfolio/projects/projectDisplay";
import PageWrapper from "@/components/pages/pageWrapper";
import { readMarkdownFiles } from "@/lib/markdown";
import { Project } from "@/types";

async function PortfolioPage() {
  const projects = readMarkdownFiles<Project>('data/projects');

  return (
    <PageWrapper title={"Projects"}>
      <ProjectDisplay
        projects={projects.sort((a: Project, b: Project) => a.title.localeCompare(b.title))}
      />
    </PageWrapper>
  );
}

export default PortfolioPage;
