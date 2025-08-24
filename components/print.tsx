"use client";
import { Box } from "@mui/material";
import Button from "@/components/ui/Button";
import React, { ReactNode, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import CustomThemeProvider, { CustomThemeProviderProps } from "./theme/customThemeProvider";

interface ExportProps {
  children: ReactNode;
  printComponent?: ReactNode;
  fileName?: string;
  fontSize?: number;
}

export const Print: React.FC<ExportProps> = ({ children, printComponent, fileName, fontSize }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: fileName || "download",
    pageStyle: `@page { size: A4; margin: 0; margin-top:10px }`,
  });

  const customThemeProviderProps: Partial<CustomThemeProviderProps> = {
    forceSmallerBreakpoints: true,
    printFontSizes: true,
    fontSize,
  }

  return (
    <CustomThemeProvider {...customThemeProviderProps}>
      <>{children}</>
      <Button
        variant="secondary"
        sx={{
          mt: 3,
          width: "100%"
        }}
        onClick={handlePrint}
      >
        Print
      </Button>
      <Box
        sx={{
          position: "absolute",
          top: -99999,
          left: -99999,
          width: "210mm",
          padding: 0,
          margin: 0,
          overflow: "hidden",
          visibility: "hidden",
        }}
      >
        <Box
          ref={contentRef}
          sx={{
            width: "210mm",
            padding: 0,
            margin: 0,
          }}
        >
          <CustomThemeProvider {...customThemeProviderProps} forceMode="light">
            {printComponent}
          </CustomThemeProvider>
        </Box>
      </Box>
    </CustomThemeProvider>
  );
};

export default Print;
