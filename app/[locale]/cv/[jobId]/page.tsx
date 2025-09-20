'use client'
import CvPage from "@/components/pages/cv/cvPage";
import React, { useEffect, use } from "react";

type PageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

//This route is used for the chrome extension
// It will receive a jobId and fetch the saved text
export default function Page({ params }: PageProps) {
  const { jobId } = use(params);

  const [pageText, setPageText] = React.useState("");

  useEffect(() => {
    console.log("CV Page: Setting up message listener for job ID:", jobId);

    // Listen for the response from the content script
    const handleMessage = (event: MessageEvent) => {
      console.log("CV Page: Received message:", event.data);
      if (event.data.action === "RECEIVED_SAVED_TEXT") {
        console.log("CV Page: Setting page text to:", event.data.text);
        setPageText(event.data.text);
      }
    };

    window.addEventListener("message", handleMessage);

    // Send a message to the content script
    console.log("CV Page: Sending GET_SAVED_TEXT message for job ID:", jobId);
    window.postMessage({ action: "GET_SAVED_TEXT", jobId }, "*");

    // Cleanup the event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [jobId]);

  return <CvPage jobDescription={pageText} />;
}
