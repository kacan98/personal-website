'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
    background: {
      default: '#0f172a',
      paper: '#0f172a',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Urbanist", "Cormorant Garamond", "Yeseva One", system-ui, sans-serif',
  },
});

interface MinimalThemeProviderProps {
  children: ReactNode;
}

export default function MinimalThemeProvider({ children }: MinimalThemeProviderProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}