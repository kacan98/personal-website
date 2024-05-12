import React from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import { getProjectBySlug } from "@/sanity/sanity-utils";
import { Box } from "@mui/material";
import SanityPicture from "@/components/sanityPicture";
import BlockContent from "@/components/blockContent";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    projectSlug: string;
  };
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
  const project = await getProjectBySlug(params.projectSlug);
  if (!project) return notFound();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "background.paper",
        color: "text.primary",
        overflow: "auto",
      }}
    >
      <PageWrapper title={project.title} description={project.description}>
        {project.image && (
          <Box mb={3} sx={{ width: "100%", maxHeight: "100%" }}>
            <SanityPicture
              fitMode={"clip"}
              sanityImage={project.image}
              alt={"project image"}
            />
          </Box>
        )}
        {
          <Box textAlign="left">
            <BlockContent value={project.relatedPage.content} />
          </Box>
        }
      </PageWrapper>
    </Box>
  );
}
