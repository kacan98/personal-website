import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import PageWrapper from "@/components/pages/pageWrapper";
import Grid2 from "@mui/material/Unstable_Grid2";
import Image from "next/image";
import { Gallery } from "@/sanity/schemaTypes/gallery";
import { getProjectsByRefs } from "@/sanity/sanity-utils";
import { urlForImage } from "@/sanity/lib/image";

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
        {projects.map((project) => {
          return (
            <Card
              sx={{ width: 350, height: 400, m: 2, p: 2, borderRadius: 3 }}
              variant="outlined"
              key={project.title}
            >
              <CardContent>
                <Grid2
                  container
                  justifyContent="center"
                  alignItems="center"
                  columnSpacing={5}
                  direction="column"
                  sx={{
                    height: "100%",
                  }}
                >
                  <Box
                    display="box"
                    mb={2}
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 200,
                      overflow: "hidden",
                      borderRadius: 1,
                    }}
                  >
                    <Image
                      src={urlForImage(project.image)}
                      alt={`Picture of ${project.title}`}
                      objectFit={"cover"}
                      layout={"fill"}
                    ></Image>
                  </Box>
                  <Typography variant="h5">{project.title}</Typography>
                  <Typography variant="body2">{project.description}</Typography>
                </Grid2>
              </CardContent>
            </Card>
          );
        })}
      </Grid2>
    </PageWrapper>
  );
}

export default GalleryPage;
