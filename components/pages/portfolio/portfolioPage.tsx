import React from "react";
import { Card, CardContent } from "@mui/material";
import ProjectDisplay from "@/components/pages/portfolio/projects/proejctDisplay";
import PageWrapper from "@/components/pages/pageWrapper";

function PortfolioPage() {
  return (
    <PageWrapper
      title={"Projects"}
      description={"Here are some of my projects"}
    >
      <Card>
        <CardContent>
          <ProjectDisplay
            projects={[
              {
                title: "Common Birthday Calculator",
                description:
                  "Calculates the common birthday of a group of people",
                image: "https://via.placeholder.com/150",
                tags: ["Angular", "TypeScript"],
                url: "https://github.com/kacan98/common-age-calculator",
              },
              {
                title: "R8tit",
                description: "An app for rating supermarkets",
                image: "https://via.placeholder.com/150",
                tags: ["C#", "SQL", "Angular", "TypeScript"],
                url: "https://github.com/kacan98/r8tit",
              },
              {
                title: "Buying vs Renting",
                description: "A calculator for buying vs renting a property",
                image: "https://via.placeholder.com/150",
                tags: ["React", "TypeScript", "Redux"],
                url: "https://github.com/kacan98/buying-vs-renting",
              },
              {
                title: "This Portfolio",
                description: "My portfolio",
                image: "https://via.placeholder.com/150",
                tags: ["Next.js", "TypeScript", "React", "Next.js"],
                url: "https://github.com/kacan98/my-porfolio",
              },
              {
                title: "Teams app",
                description: "An app for managing teams",
                image: "https://via.placeholder.com/150",
                tags: ["Angular", "TypeScript"],
                url: "https://github.com/josef-kriz/team-app",
              },
            ].sort((a, b) => a.title.localeCompare(b.title))}
          />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

export default PortfolioPage;
