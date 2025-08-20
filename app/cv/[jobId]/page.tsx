'use client'
import CvPage from "@/components/pages/cv/cvPage";
import BackgroundEffect from "@/components/layout/BackgroundEffect";
import { Box } from "@mui/material";
import { BACKGROUND_COLORS } from "@/app/colors";
import React, { useEffect } from "react";

type PageProps = {
  params: {
    jobId: string;
  };
};

//This route is used for the chrome extension
// It will receive a jobId and fetch the saved text
export default function Page({ params }: PageProps) {
  const { jobId } = params;

  const [pageText, setPageText] = React.useState("");

  useEffect(() => {
    // Listen for the response from the content script
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === "RECEIVED_SAVED_TEXT") {
        setPageText(event.data.text);
      }
    };

    window.addEventListener("message", handleMessage);

    // Send a message to the content script
    window.postMessage({ action: "GET_SAVED_TEXT", jobId }, "*");

    // Cleanup the event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [jobId]);

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
        backgroundColor: BACKGROUND_COLORS.primary,
        overflow: 'auto',
        zIndex: 1, // Below navbar but above background
      }}
    >
      <BackgroundEffect containInParent={true} />
      <CvPage jobDescription={pageText} />
    </Box>
  );
}
