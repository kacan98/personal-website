import { Box, Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import { Project } from "@/types";
import { SUPPORTED_ICONS } from "@/components/icon";
import Image from "next/image";

export const ProjectCard = ({ title, description, image, links }: Project) => {
  const imageSrc = image?.trim();

  return (
    <Card
      sx={{
        width: "100%",
        height: 480,
        borderRadius: 3,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        }
      }}
      variant="outlined"
    >
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}>
        <Box
          display="flex"
          justifyContent="center"
          mb={2}
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <Box
            width={300}
            height={200}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: imageSrc
                ? "transparent"
                : "linear-gradient(135deg, rgba(168, 85, 247, 0.18) 0%, rgba(17, 24, 39, 0.95) 100%)",
              borderRadius: 2,
              px: 2,
            }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={`Image of ${title} project`}
                width={300}
                height={200}
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            ) : (
              <Typography
                variant="h6"
                sx={{ color: "rgba(255,255,255,0.92)", fontWeight: 700, textAlign: "center" }}
              >
                {title}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", textAlign: "center" }}>
          <Typography variant="h6" sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            mb: 1,
            color: "text.primary"
          }}>{title}</Typography>
          <Typography variant="body2" sx={{ mb: 2, flex: 1 }}>{description}</Typography>

          <Box sx={{ mt: "auto" }}>
            <Grid container alignItems="center" justifyContent="center">
              {links &&
                links.map(({ url, iconName }, index) => {
                  const isExternal = url.startsWith("http");
                  return (
                    <IconButton key={`${url}-${index}`} href={url} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
                      {SUPPORTED_ICONS[iconName]?.component()}
                    </IconButton>
                  );
                })}
            </Grid>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
