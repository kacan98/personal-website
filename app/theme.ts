"use client";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
      info: {
        main: "#fff",
      },
      action: {
        active: "#fff", // choose a suitable color for icons
      },
    },
    typography: {
      fontFamily: "system-ui, sans-serif",
      allVariants: {
        color: "#fff",
      },

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
      button: {
        fontWeight: 500,
      },
    },
    components: {
      MuiIcon: {
        styleOverrides: {
          root: {
            color: "#fff",
          },
        },
      },
    },
  }),
);

export default theme;
