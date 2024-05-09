import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Project } from "@/sanity/schemaTypes/project";
import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import { sanityClient } from "@/sanity/lib/sanityClient";
import { SUPPORTED_ICONS } from "@/components/icon";

export const ProjectCard = ({ title, description, image, links }: Project) => {
  const imageProps = useNextSanityImage(sanityClient, image, {
    imageBuilder: (builder) => builder.width(300).height(200),
  });
  return (
    <Card
      sx={{
        width: 350,
        maxWidth: "78vw",
        minHeight: 400,
        m: 2,
        p: 2,
        borderRadius: 3,
      }}
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
          <Box
            display="flex"
            mb={2}
            sx={{
              maxWidth: "100%",
              overflow: "hidden",
            }}
          >
            <Image
              {...imageProps}
              alt={`Image of ${title} project`}
              unoptimized
            />
          </Box>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2">{description}</Typography>
          <Grid2 container alignItems="center" justifyContent="center">
            {links &&
              links.map(({ url, iconName, title }) => (
                <IconButton key={title} href={url} target="_blank">
                  {SUPPORTED_ICONS[iconName]?.component()}
                </IconButton>
              ))}
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};
