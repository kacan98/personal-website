'use client'
import CvPage from "@/components/pages/cv/cvPage";
import CustomThemeProvider from "@/components/theme/customThemeProvider";
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

    // Send a message to the content script
    window.postMessage({ action: "GET_SAVED_TEXT", jobId }, "*");

    // Cleanup the event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [jobId]);

  return (
    <Box sx={{
      width: "100%",
      height: "100%",
      bgcolor: "background.paper",
      color: "text.primary",
      overflow: "auto",
    }}>

      <CustomThemeProvider>
        <CvPage jobDescription={pageText} />
      </CustomThemeProvider>
    </Box>
  );
}
