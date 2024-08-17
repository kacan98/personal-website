"use client";
import React, { ReactNode, useRef } from "react";
import { Box, Button } from "@mui/material";
import DownloadThemeWrapper from "@/components/download/downloadThemeWrapper";
import { ReactToPrint } from "react-to-print";

interface ExportProps {
  children: ReactNode;
  fileName?: string;
}

export const Print: React.FC<ExportProps> = ({ children, fileName }) => {
  const ref = useRef<HTMLDivElement>(null);

  const reactToPrintTrigger = React.useCallback(() => {
    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
    // to the root node of the returned component as it will be overwritten.

    // Bad: the `onClick` here will be overwritten by `react-to-print`
    // return <button onClick={() => alert('This will not work')}>Print this out!</button>;

    // Good
    return (
      <Button
        variant="contained"
        color="info"
        fullWidth
        sx={{
          mt: 3,
        }}
      >
        Print
      </Button>
    );
  }, []);

  const reactToPrintContent = React.useCallback(() => {
    return ref.current;
  }, [ref.current]);

  return (
    <>
      <>{children}</>
      <ReactToPrint
        content={reactToPrintContent}
        documentTitle={fileName ? fileName : "download"}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      ></ReactToPrint>
      <Box
        sx={{
          position: "absolute",
          right: 99999,
          width: 905,
          padding: 3,
          margin: 3,
          "@media print": {
            transform: "scale(0.9)",
          },
        }}
      >
        <Box
          ref={ref}
          sx={{
            width: 905,
            padding: 3,
          }}
        >
          <DownloadThemeWrapper>{children}</DownloadThemeWrapper>
        </Box>
      </Box>
    </>
  );
};

export default Print;
