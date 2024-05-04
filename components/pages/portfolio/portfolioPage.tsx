import React from "react";
import { Card, CardContent } from "@mui/material";
import ProjectDisplay from "@/components/pages/portfolio/projects/proejctDisplay";
import PageWrapper from "@/components/pages/pageWrapper";
import { getProjects } from "@/sanity/sanity-utils";

async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <PageWrapper title={"Projects"}>
      <Card>
        <CardContent>
          <ProjectDisplay
            projects={projects.sort((a, b) => a.title.localeCompare(b.title))}
          />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

export default PortfolioPage;
