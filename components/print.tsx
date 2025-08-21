"use client";
import { Box, Button } from "@mui/material";
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
        variant="contained"
        color="info"
        fullWidth
        sx={{
          mt: 3,
        }}
        onClick={handlePrint}
      >
        Print
      </Button>
      <Box
        sx={{
          position: "absolute",
          right: 99999,
          width: 905,
          padding: 3,
          margin: 3,

        }}
      >
        <Box
          ref={contentRef}
          sx={{
            width: 905,
            padding: 3,
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
