"use client";
import { StylesSettings } from "@/sanity/schemaTypes/singletons/stylesSettings";
import { Theme } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material/styles/createTheme";
import { BRAND_COLORS } from "./colors";

const getBaseTheme = (fontSize:number): ThemeOptions => {
  // createTheme somehow breaks at least fonts below,
  // so modify and set below instead
  return {
    typography: {
      fontFamily: "system-ui, sans-serif",
      fontSize,

      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
      },
    },
    components: {
      MuiContainer: {
        defaultProps: {
          maxWidth: "md",
        },
      },
    },
  };
};

export function getTheme({
  styles,
  forceMode,
  forceSmallerBreakpoints,
  printFontSizes,
  fontSize = 14,
}: {
  styles?: StylesSettings;
  forceMode?: "dark" | "light";
  forceSmallerBreakpoints?: boolean;
  printFontSizes?: boolean;
  fontSize?: number;
}): Theme {
  const baseTheme = getBaseTheme(fontSize);

  baseTheme.typography = {
    ...baseTheme.typography,
    fontFamily: styles?.font,
  };

  if (printFontSizes) {
    baseTheme.typography = {
      ...baseTheme.typography,
      fontSize,
      h1: {
        fontSize: "2rem",
      },
      h2: {
        fontSize: "1.7rem",
      },
      h3: {
        fontSize: "1.5rem",
      },
      h4: {
        fontSize: "1.25rem",
      },
      h5: {
        fontSize: "1.2rem",
      },
      h6: {
        fontSize: "1.1rem",
      },
    };
  }

  if (forceSmallerBreakpoints) {
    baseTheme.breakpoints = {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1280,
        xl: 1920,
      },
    };
  }

  if (styles?.theme === "light" || forceMode === "light") {
    return createTheme({
      ...baseTheme,
      palette: {
        ...baseTheme.palette,
        mode: "light",
        primary: {
          ...baseTheme.palette?.primary,
          main: "#000000",
        },
        background: {
          default: "#ffffff",
          paper: "#ffffff",
        },
        text: {
          primary: "#000000",
          secondary: "rgba(0, 0, 0, 0.7)",
          disabled: "rgba(0, 0, 0, 0.5)",
        },
      },
    });
  }

  return createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      mode: "dark",
      primary: {
        ...baseTheme.palette?.primary,
        main: "#fff",
      },
      secondary: {
        main: BRAND_COLORS.accent,
        dark: BRAND_COLORS.dark, 
        light: BRAND_COLORS.secondary,
      },
      text: {
        primary: "#ffffff",
        secondary: "rgba(255, 255, 255, 0.7)",
        disabled: "rgba(255, 255, 255, 0.5)",
      },
    },
    components: {
      // Override MUI Typography to use white text by default
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "#ffffff",
          },
        },
      },
    },
  });
}
