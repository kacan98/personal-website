'use client';

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CopyButton from "./CopyButton";
import { CVSettings } from "@/types";

function Page() {
  const [cvSettings, setCvSettings] = useState<CVSettings | null>(null);

  useEffect(() => {
    const loadCvSettings = async () => {
      const response = await fetch('/api/cv/settings?locale=en');
      if (response.ok) {
        const settings = await response.json();
        setCvSettings(settings);
      }
    };
    loadCvSettings();
  }, []);
  
  if (!cvSettings) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }
  
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
        CV in JSON format
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
            color: "#333",
          }}
        >
          {JSON.stringify(cvSettings, null, 2)}
        </Typography>
      </Box>
    </Box>
  );
}

export default Page;
