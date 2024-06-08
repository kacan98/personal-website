"use client";
import { createTheme } from "@mui/material/styles";
import { Theme } from "@mui/material";
import { StylesSettings } from "@/sanity/schemaTypes/singletons/stylesSettings";
import { ThemeOptions } from "@mui/material/styles/createTheme";

const getBaseTheme = (): ThemeOptions => {
  // createTheme somehow breaks at least fonts below,
  // so modify and set below instead
  return {
    typography: {
      fontFamily: "system-ui, sans-serif",
      fontSize: 14,

      h1: {
        fontSize: "2.5em",
        fontWeight: 700,
      },
      h2: {
        fontSize: "2.3em",
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
type getThemeProps = {
  styles?: StylesSettings;
  forceMode?: "dark" | "light";
  forceSmallerBreakpoints?: boolean;
};

export function getTheme({
  styles,
  forceMode,
  forceSmallerBreakpoints,
}: getThemeProps): Theme {
  const baseTheme = getBaseTheme();
  if (styles?.font && styles.font !== "System font") {
    baseTheme.typography = {
      ...baseTheme.typography,
      fontFamily: styles.font,
      body1: {
        fontFamily: "'Open Sans Variable', sans-serif",
      },
      body2: {
        fontFamily: "'Open Sans Variable', sans-serif",
      },
      caption: {
        fontFamily: "'Open Sans Variable', sans-serif",
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
        mode: "light",
        primary: {
          main: "#000000",
        },
      },
    });
  }

  return createTheme({
    ...baseTheme,
    palette: {
      mode: "dark",
      primary: {
        main: "#fff",
      },
    },
  });
}
