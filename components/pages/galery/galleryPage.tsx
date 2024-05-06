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

  return process.env.NODE_ENV === "production" ? (
    <></>
  ) : (
    <PageWrapper title={gallery.title}>
      <Grid2
        container
        justifyContent="center"
        alignItems={"center"}
        columnSpacing={5}
        direction="row"
      >
        <GalleryComponent projects={projects} />
      </Grid2>
    </PageWrapper>
  );
}

export default GalleryPage;
