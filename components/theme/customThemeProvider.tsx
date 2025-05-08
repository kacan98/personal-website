"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { StylesSettings } from "@/sanity/schemaTypes/singletons/stylesSettings";
import { getTheme } from "@/app/theme";

export type CustomThemeProviderProps = {
  children: React.ReactNode;
  styles?: StylesSettings;
  forceMode?: "light" | "dark";
  forceSmallerBreakpoints?: boolean;
  printFontSizes?: boolean;
  fontSize?: number;
};

export function CustomThemeProvider({
  children,
  styles,
  forceMode,
  forceSmallerBreakpoints,
  printFontSizes,
  fontSize
}: CustomThemeProviderProps) {
  const theme = getTheme({ styles, forceMode, forceSmallerBreakpoints, printFontSizes, fontSize });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
