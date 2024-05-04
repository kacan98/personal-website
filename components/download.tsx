"use client";
import React, { ReactNode, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import JsPdf from "jspdf";
import { Box, Button } from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { Theme } from "@mui/material";

interface ExportProps {
  children: ReactNode;
}

export const Download: React.FC<ExportProps> = ({ children }) => {
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg"),
  );
  const printDocument = useCallback(async (element: HTMLDivElement) => {
    // Clone the element and apply a fixed width
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Append the clone to the body, off-screen
    clonedElement.style.position = "absolute";
    clonedElement.style.left = "9999px";
    document.body.appendChild(clonedElement);

    // Generate the canvas
    const canvas = await html2canvas(clonedElement, {
      useCORS: true,
    });

    // Generate the PDF
    const imgData = canvas.toDataURL("image/jpeg");
    const documentWidth = 210;
    const documentHeight = (canvas.height * documentWidth) / canvas.width;

    const doc = new JsPdf(
      "portrait",
      "mm",
      [documentWidth, documentHeight],
      true,
    );

    // Add the image to the PDF
    doc.addImage(imgData, "JPEG", 0, 0, documentWidth, documentHeight);
    doc.save("download.pdf");

    // Remove the cloned element from the body
    document.body.removeChild(clonedElement);
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <>{children}</>
      <Box
        ref={ref}
        sx={(theme) => ({
          position: "absolute",
          right: 99999,
          width: 905,
          backgroundColor: theme.palette.background.paper,
          padding: 3,
          margin: 3,
        })}
      >
        {children}
      </Box>

      {/* Unfortunetly I've seen the button fail on phones :( */}
      {!isSmallScreen && (
        <Button
          variant="contained"
          color="info"
          fullWidth
          onClick={() => ref.current && printDocument(ref.current)}
          sx={{
            mt: 3,
          }}
        >
          Download
        </Button>
      )}
    </>
  );
};

export default Download;
