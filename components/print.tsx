"use client";
import { Box, Button } from "@mui/material";
import React, { ReactNode, useRef } from "react";
import { ReactToPrint } from "react-to-print";
import CustomThemeProvider, { CustomThemeProviderProps } from "./theme/customThemeProvider";

interface ExportProps {
  children: ReactNode;
  fileName?: string;
  fontSize?: number;
}

export const Print: React.FC<ExportProps> = ({ children, fileName, fontSize }) => {
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

  const customThemeProviderProps: Partial<CustomThemeProviderProps> = {
    forceSmallerBreakpoints: true,
    printFontSizes: true,
    fontSize,
  }

  return (
    <CustomThemeProvider {...customThemeProviderProps}>
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

        }}
      >
        <Box
          ref={ref}
          sx={{
            width: 905,
            padding: 3,
          }}
        >
          <CustomThemeProvider {...customThemeProviderProps} forceMode="light">
            {children}
          </CustomThemeProvider>
        </Box>
      </Box>
    </CustomThemeProvider>
  );
};

export default Print;
