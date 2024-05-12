import React from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Gallery } from "@/sanity/schemaTypes/gallery";
import { getProjectsByRefs } from "@/sanity/sanity-utils";
import GalleryComponent from "@/components/pages/galery/galleryComponent";

async function GalleryPage(gallery: Gallery) {
  const projects = await getProjectsByRefs(
    gallery.projectRefs.map((p) => p._ref),
  );
  return (
    <PageWrapper title={gallery.title} containerMaxWidth="lg">
      <Grid2
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
      </Grid2>
    </PageWrapper>
  );
}

export default GalleryPage;
