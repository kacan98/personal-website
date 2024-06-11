import React from "react";
import CustomThemeProvider from "@/components/theme/customThemeProvider";

type ThemeWrapperProps = {
  children: React.ReactNode;
};

function DownloadThemeWrapper({ children }: ThemeWrapperProps) {
  return (
    <CustomThemeProvider forceSmallerBreakpoints forceMode="light">
      {children}
    </CustomThemeProvider>
  );
}

export default DownloadThemeWrapper;
