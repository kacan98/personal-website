import React from "react";
import ClientProjectDisplay from "@/components/pages/portfolio/projects/clientProjectDisplay";
import SectionHeader from "@/components/ui/SectionHeader";
import { readMarkdownFiles } from "@/lib/markdown";
import { Project } from "@/types";
import { Box } from "@mui/material";

interface PortfolioPageProps {
  title: string;
  locale: string;
}

async function PortfolioPage({ title, locale }: PortfolioPageProps) {
  let projectsFolder = 'data/projects';
  if (locale === 'da') {
    projectsFolder = 'data/projects-da';
  } else if (locale === 'sv') {
    projectsFolder = 'data/projects-sv';
  }

  const allProjects = readMarkdownFiles<Project>(projectsFolder)
    .sort((a: Project, b: Project) => {
      // Sort by order field if it exists, otherwise by title
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <Box sx={{ py: 6 }}>
      <SectionHeader
        title={title}
        size="large"
      />
      <ClientProjectDisplay allProjects={allProjects} />
    </Box>
  );
}

export default PortfolioPage;
