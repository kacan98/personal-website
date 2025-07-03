'use client'
import CvPage from "@/components/pages/cv/cvPage";
import BackgroundEffect from "@/components/layout/BackgroundEffect";
import { Box } from "@mui/material";
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

    // Send a message to the content script with retry mechanism
    const sendMessage = () => {
      window.postMessage({ action: "GET_SAVED_TEXT", jobId }, "*");
    };

    // Send immediately
    sendMessage();
    
    // Retry after 100ms in case content script wasn't ready
    const retryTimeout = setTimeout(sendMessage, 100);
    
    // Another retry after 500ms
    const retryTimeout2 = setTimeout(sendMessage, 500);

    // Cleanup the event listener and timeouts
    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(retryTimeout);
      clearTimeout(retryTimeout2);
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
        backgroundColor: '#0f172a',
        overflow: 'auto',
        zIndex: 1, // Below navbar but above background
      }}
    >
      <BackgroundEffect containInParent={true} />
      <CvPage jobDescription={pageText} />
    </Box>
  );
}
