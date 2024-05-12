"use client";
import { createTheme } from "@mui/material/styles";
import { Theme } from "@mui/material";
import { StylesSettings } from "@/sanity/schemaTypes/singletons/stylesSettings";
import { ThemeOptions } from "@mui/material/styles/createTheme";

//create a type for the first argument of createTheme
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

export function getTheme(styles?: StylesSettings): Theme {
  const baseTheme = getBaseTheme();
  console.log(styles?.font);
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

  if (styles?.theme === "light") {
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
