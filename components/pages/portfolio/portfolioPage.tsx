import React from "react";
import ProjectDisplay from "@/components/pages/portfolio/projects/projectDisplay";
import PageWrapper from "@/components/pages/pageWrapper";
import { getProjects } from "@/sanity/sanity-utils";

async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <PageWrapper title={"Projects"}>
      <ProjectDisplay
        projects={projects.sort((a, b) => a.title.localeCompare(b.title))}
      />
    </PageWrapper>
  );
}

export default PortfolioPage;
