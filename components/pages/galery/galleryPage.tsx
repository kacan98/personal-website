import React from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import { Grid } from "@mui/material";
import { Gallery } from "@/types";
import { getListedProjects } from "@/lib/projects";
import GalleryComponent from "@/components/pages/galery/galleryComponent";

async function GalleryPage(gallery: Gallery) {
  const projects = await getListedProjects("en");

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
