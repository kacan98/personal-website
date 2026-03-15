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
  const allProjects = getListedProjects(locale);

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
