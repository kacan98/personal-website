import CvPage from "@/components/pages/cv/cvPage";
import BackgroundEffect from "@/components/layout/BackgroundEffect";
import { Box } from "@mui/material";

export default function CV() {
  // Main CV route - no job description from Chrome extension
  
  return (
    <Box 
      sx={{ 
        // Ensure full coverage to prevent white blocks
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        color: "text.primary", // This makes text white
        backgroundColor: '#0f172a',
        overflow: 'auto',
        zIndex: 1, // Below navbar but above background
      }}
    >
      <BackgroundEffect containInParent={true} />
      <CvPage />
    </Box>
  );
}
