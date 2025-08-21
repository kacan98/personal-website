import { Box, Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import { Project } from "@/sanity/schemaTypes/project";
import { SUPPORTED_ICONS } from "@/components/icon";
import SanityPicture from "@/components/sanityPicture";

export const ProjectCard = ({ title, description, image, links }: Project) => {

  return (
    <Card
      sx={{
        width: 350,
        maxWidth: "78vw",
        height: 520,
        m: 2,
        p: 2,
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
        {/* Image Section */}
        <Box
          display="flex"
          justifyContent="center"
          mb={2}
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <Box width={300} height={200}>
            {/*This should work better... */}
            <SanityPicture
              sanityImage={image}
              alt={`Image of ${title} project`}
              width={300}
              height={200}
              fitMode="scale"
            />
          </Box>
        </Box>
        
        {/* Content Section - grows to fill space */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", textAlign: "center" }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            fontSize: '1.25rem',
            mb: 1,
            color: 'text.primary'
          }}>{title}</Typography>
          <Typography variant="body2" sx={{ mb: 2, flex: 1 }}>{description}</Typography>
          
          {/* Buttons Section - always at bottom */}
          <Box sx={{ mt: "auto" }}>
            <Grid container alignItems="center" justifyContent="center">
              {links &&
                links.map(({ url, iconName }) => (
                  <IconButton key={iconName} href={url} target="_blank">
                    {SUPPORTED_ICONS[iconName]?.component()}
                  </IconButton>
                ))}
            </Grid>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
