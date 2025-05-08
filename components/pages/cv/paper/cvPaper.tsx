import { EditableText } from "@/components/editableText";
import { useAppSelector } from "@/redux/hooks";
import { Box, Paper } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { CvSectionComponent } from "../cvSectionComponent";

type CvPaperProps = {
  editable?: boolean;
};

export function CvPaper({ editable }: CvPaperProps) {
  const reduxCv = useAppSelector((state) => state.cv);

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
            <EditableText query={["name"]} editable={editable} variant="h4" component="div" text={reduxCv.name} />
            <EditableText query={["subtitle"]} editable={editable} variant="body1" pb={2} text={reduxCv.subtitle} />
          </Grid2>
          {reduxCv.sideColumn?.map((section, index) => (
            <Box key={index} mb={2}>
              <CvSectionComponent sideOrMain="sideColumn" sectionIndex={index} section={section} editable={editable} />
            </Box>
          ))}
        </Box>
      </Grid2>
      <Grid2 xs={12} md={8} textAlign="left">
        {reduxCv.mainColumn?.map((section, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <CvSectionComponent sideOrMain="mainColumn" sectionIndex={index} section={section} editable={editable} />
          </Paper>
        ))}
      </Grid2>
    </Grid2>
    
  );
}

export default CvPaper;
