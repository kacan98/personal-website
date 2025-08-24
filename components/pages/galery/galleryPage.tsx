import React from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import { Grid } from "@mui/material";
import { Gallery, Project } from "@/types";
import { readMarkdownFiles } from "@/lib/markdown";
import GalleryComponent from "@/components/pages/galery/galleryComponent";

async function GalleryPage(gallery: Gallery) {
  const projects = readMarkdownFiles<Project>('data/projects');
  return (
    <PageWrapper title={gallery.title} containerMaxWidth="lg">
      <Grid
        container
        justifyContent="center"
        alignItems={"center"}
        columnSpacing={5}
        direction="row"
      >
        <GalleryComponent
          projects={projects}
          filteringIsEnabled={!!gallery.filteringIsEnabled}
        />
      </Grid>
    </PageWrapper>
  );
}

export default GalleryPage;
