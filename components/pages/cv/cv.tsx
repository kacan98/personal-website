import CvSectionComponent from "@/components/pages/cv/cvSectionComponent";
import { CvSection as CvSectionSanitySchemaType } from "@/sanity/schemaTypes/cv/cvSection";
import { Box, Paper, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

type CvProps = {
  name: string;
  intro: string;
  // picture: string;
  mainSection: CvSectionSanitySchemaType[];
  sideSection?: CvSectionSanitySchemaType[];
};

export function cv({ name, intro, sideSection, mainSection }: CvProps) {
  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} sm={4}>
        <Box display="flex" flexDirection="column" alignItems="left">
          <Grid2
            container
            alignItems="left"
            direction="column"
            textAlign="left"
          >
            {/*<Avatar*/}
            {/*  alt={name}*/}
            {/*  src={picture}*/}
            {/*  sx={{ width: 100, height: 100, marginBottom: "15px" }}*/}
            {/*/>*/}
            <Typography variant="h4" component="div" >
              {name}
            </Typography>
            <Typography variant="body1" pb={2}>
              {intro}
            </Typography>
          </Grid2>
          {sideSection?.map((sections, index) => (
            <Box key={index} mb={2}>
              <CvSectionComponent {...sections} />
            </Box>
          ))}
        </Box>
      </Grid2>
      <Grid2 xs={12} md={8} textAlign="left">
        {mainSection?.map((section, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <CvSectionComponent {...section} />
          </Paper>
        ))}
      </Grid2>
    </Grid2>
  );
}

export default cv;
