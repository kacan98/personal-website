import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { GitHub, OpenInNew } from "@mui/icons-material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Project } from "@/sanity/schemaTypes/project";
import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import { sanityClient } from "@/sanity/lib/sanityClient";

export const ProjectCard = ({
  title,
  description,
  image,
  githubUrl,
  deploymentUrl,
}: Project) => {
  const imageProps = useNextSanityImage(sanityClient, image, {
    imageBuilder: (builder) => builder.width(300).height(200),
  });
  return (
    <Card
      sx={{ width: 350, minHeight: 400, m: 2, p: 2, borderRadius: 3 }}
      variant="outlined"
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
          <Box display="flex" mb={2}>
            <Image
              {...imageProps}
              alt={`Image of ${title} project`}
              unoptimized
            />
          </Box>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2">{description}</Typography>
          <Grid2 container alignItems="center" justifyContent="center">
            {githubUrl && (
              <Link href={githubUrl} target={"_blank"}>
                <IconButton>
                  <GitHub />
                </IconButton>
              </Link>
            )}
            {deploymentUrl && (
              <Link href={deploymentUrl} target={"_blank"}>
                <IconButton>
                  <OpenInNew />
                </IconButton>
              </Link>
            )}
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};
