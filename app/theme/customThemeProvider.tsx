"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { StylesSettings } from "@/sanity/schemaTypes/singletons/stylesSettings";
import { getTheme } from "@/app/theme";

type CustomThemeProviderProps = {
  children: React.ReactNode;
  styles?: StylesSettings;
};

function CustomThemeProvider({ children, styles }: CustomThemeProviderProps) {
  const theme = getTheme(styles);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
