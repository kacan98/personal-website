import React from "react";
import ClientProjectDisplay from "@/components/pages/portfolio/projects/clientProjectDisplay";
import SectionHeader from "@/components/ui/SectionHeader";
import { getListedProjects } from "@/lib/projects";
import { Box } from "@mui/material";

interface PortfolioPageProps {
  title: string;
  locale: string;
}

async function PortfolioPage({ title, locale }: PortfolioPageProps) {
  const allProjects = await getListedProjects(locale);
  const clientProjects = allProjects.map(({ Content: _contentComponent, content: _content, ...project }) => project);

  return (
    <Box sx={{ py: 6 }}>
      <SectionHeader
        title={title}
        size="large"
      />
      <ClientProjectDisplay allProjects={clientProjects} locale={locale} />
    </Box>
  );
}

export default PortfolioPage;
