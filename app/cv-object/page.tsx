import { getCvSettings } from "@/sanity/sanity-utils";
import { Box, Typography } from "@mui/material";
import React from "react";
import CopyButton from "./CopyButton";

async function Page() {
  const cvSettings = await getCvSettings();
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={4}
      minHeight="100vh"
    >
      <Typography variant="h4" gutterBottom>
        CV Settings
      </Typography>
      <CopyButton jsonData={JSON.stringify(cvSettings, null, 2)} />
      <Box
        sx={{
          maxHeight: "70vh",
          overflow: "auto",
          backgroundColor: "#f5f5f5",
          p: 2,
          borderRadius: 2,
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <Typography
          variant="body1"
          component="pre"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "monospace",
          }}
        >
          {JSON.stringify(cvSettings, null, 2)}
        </Typography>
      </Box>
    </Box>
  );
}

export default Page;
