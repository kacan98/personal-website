import React from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import { Grid } from "@mui/material";
import { Gallery } from "@/types";
import { getListedProjects } from "@/lib/projects";
import GalleryComponent from "@/components/pages/galery/galleryComponent";

type GalleryPageProps = Gallery & {
  locale: string;
};

async function GalleryPage({ locale, ...gallery }: GalleryPageProps) {
  const projects = await getListedProjects(locale);

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
          locale={locale}
          projects={projects}
          filteringIsEnabled={!!gallery.filteringIsEnabled}
        />
      </Grid>
    </PageWrapper>
  );
}

export default GalleryPage;
