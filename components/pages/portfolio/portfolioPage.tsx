import React from "react";
import { Card, CardContent } from "@mui/material";
import ProjectDisplay from "@/components/pages/portfolio/projects/proejctDisplay";
import PageWrapper from "@/components/pages/pageWrapper";
import { karelsProjects } from "@/store/staticObjects";

function PortfolioPage() {
  return (
    <PageWrapper
      title={"Projects"}
      description={"Here are some of my projects"}
    >
      <Card>
        <CardContent>
          <ProjectDisplay
            projects={karelsProjects.sort((a, b) =>
              a.title.localeCompare(b.title),
            )}
          />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

export default PortfolioPage;
