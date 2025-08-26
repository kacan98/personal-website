import React, { Suspense } from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import { Box } from "@mui/material";
import Image from "next/image";
import BlockContent from "@/components/blockContent";
import { notFound } from "next/navigation";
import { readMarkdownFiles } from "@/lib/markdown";
import { Project } from "@/types";

type PageProps = {
  params: Promise<{
    projectSlug: string;
  }>;
};

// Doesn't seem to work in production :(
// export async function generateStaticParams() {
//   const projects = await getProjects();
//
//   return projects.map((project) => ({
//     params: {
//       projectSlug: project.relatedPage?.slug || "",
//     },
//   }));
// }

export default async function Page({ params }: PageProps) {
  const { projectSlug } = await params;
  const projects = readMarkdownFiles<Project>('data/projects');
  const project = projects.find(p => p.slug === projectSlug);
  if (!project) return notFound();

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
                alt={"project image"}
                width={800}
                height={400}
                style={{ objectFit: "cover", width: '100%', height: 'auto' }}
              />
            </Box>
          )}
          <Box textAlign="left">
            <BlockContent value={project.content} />
          </Box>
        </PageWrapper>
      </Box>
    </Suspense>
  );
}
