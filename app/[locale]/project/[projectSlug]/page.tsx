import React, { Suspense } from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import { Box } from "@mui/material";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";

type PageProps = {
  params: Promise<{
    projectSlug: string;
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { projectSlug, locale } = await params;
  const project = await getProjectBySlug(locale, projectSlug);

  if (!project) {
    return notFound();
  }

  const ProjectContent = project.Content;

  return (
    <Suspense fallback={<div>Loading project...</div>}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "background.paper",
          color: "text.primary",
          overflow: "auto",
        }}
      >
        <PageWrapper title={project.title} description={project.title}>
          {project.image && (
            <Box mb={3} sx={{ width: "100%", maxHeight: "100%" }}>
              <Image
                src={project.image}
                alt={project.imageAlt || "project image"}
                width={800}
                height={400}
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            </Box>
          )}
          <Box
            textAlign="left"
            sx={{
              "& h1, & h2, & h3": { lineHeight: 1.2, mt: 4, mb: 2, fontWeight: 700 },
              "& h1": { fontSize: "2rem" },
              "& h2": { fontSize: "1.5rem" },
              "& h3": { fontSize: "1.2rem" },
              "& p": { mb: 2, lineHeight: 1.8, color: "text.secondary" },
              "& ul": { mb: 3, pl: 3, color: "text.secondary" },
              "& li": { mb: 1, lineHeight: 1.8 },
              "& figure": { my: 4, mx: 0 },
              "& img": {
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 2,
              },
              "& figcaption": {
                mt: 1,
                fontSize: "0.95rem",
                lineHeight: 1.6,
                color: "text.secondary",
              },
              "& pre": {
                p: 2,
                overflowX: "auto",
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                mb: 3,
              },
              "& code": { fontFamily: "monospace" },
              "& a": { color: "secondary.main" },
            }}
          >
            <ProjectContent />
          </Box>
        </PageWrapper>
      </Box>
    </Suspense>
  );
}
