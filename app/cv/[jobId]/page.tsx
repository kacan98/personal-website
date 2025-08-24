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

  return <CvPage jobDescription={pageText} />;
}
