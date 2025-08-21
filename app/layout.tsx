import "@/app/app.css";
import BackgroundEffect from "@/components/layout/BackgroundEffect";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/menu/navBar";
import CustomThemeProvider from "@/components/theme/customThemeProvider";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { BRAND_COLORS } from "./colors";
import {
  getCvSettings,
  getGalleries,
  getSettings,
  getStyles,
} from "@/sanity/sanity-utils";
import "@fontsource/cormorant-garamond";
import "@fontsource/open-sans";
import "@fontsource/urbanist";
import "@fontsource/yeseva-one";
import { Box, CssBaseline, LinearProgress, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { Suspense } from "react";
import StoreProvider from "./StoreProvider";

export async function generateMetadata(): Promise<Metadata> {
  // Could be dynamic but I am lazy.
  // const settings = await getSettings();
  
  return {
    title: "Karel Čančara - AI-Enhanced Full-Stack Developer",
    description: "Full-Stack Developer specializing in TypeScript, React, .NET, and AI-enhanced development. Building enterprise solutions for 200+ companies.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const styles = await getStyles();
  const settings = await getSettings();
  const galleries = await getGalleries();
  const cvSettings = await getCvSettings();

  // Build navigation links - always include basic links
  const navLinks: { name: string; href: string }[] = [
    {
      name: "About",
      href: "/about",
    }
  ];
  
  // Add gallery links
  if (galleries && galleries.length > 0) {
    navLinks.push(
      ...galleries.map((gallery) => ({
        name: gallery.title,
        href: `/gallery/${gallery.title.toLowerCase().replace(/\s+/g, '-')}`,
      }))
    );
  }

  const { chatbot } = settings?.specialPages || {};

  if (chatbot) {
    navLinks.push({
      name: "Chatbot",
      href: "/chatbot",
    });
  }

  if (cvSettings?.on) {
    navLinks.push({
      name: "Resume",
      href: "/resume",
    });
  }

  return (
    <html lang="en" data-scroll-behavior="smooth" style={{ height: '100%' }}>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0f172a', minHeight: '100vh', height: '100%' }}>
        <CssBaseline />
        <AppRouterCacheProvider>
            <ReduxProvider>
              <StoreProvider cvSettings={cvSettings}>
                <CustomThemeProvider styles={styles}>
                <Box
                  sx={{
                    minHeight: "100vh",
                    backgroundColor: "#0f172a",
                    position: "relative",
                  }}
                >
                  <BackgroundEffect />
                  {/*Had to be in Suspense because of useSearchParams inside */}
                  <Suspense fallback={
                    <Box sx={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 9999,
                    }}>
                      {/* Logo/Brand */}
                      <Box sx={{
                        mb: 4,
                        textAlign: 'center'
                      }}>
                        <Typography 
                          variant="h2" 
                          sx={{
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            mb: 1,
                            fontSize: { xs: '2.5rem', md: '3.5rem' }
                          }}
                        >
                          KC
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem'
                          }}
                        >
                          Loading Portfolio
                        </Typography>
                      </Box>
                      
                      {/* Modern Loading Animation */}
                      <Box sx={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {/* Spinning Ring */}
                        <Box sx={{
                          position: 'absolute',
                          width: '100px',
                          height: '100px',
                          border: `3px solid rgba(${BRAND_COLORS.primaryRgb}, 0.1)`,
                          borderTop: `3px solid ${BRAND_COLORS.primary}`,
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                          }
                        }} />
                        
                        {/* Inner Pulse */}
                        <Box sx={{
                          width: '60px',
                          height: '60px',
                          background: `radial-gradient(circle, ${BRAND_COLORS.primary}40, transparent)`,
                          borderRadius: '50%',
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%': { transform: 'scale(0.8)', opacity: 0.5 },
                            '50%': { transform: 'scale(1)', opacity: 1 },
                            '100%': { transform: 'scale(0.8)', opacity: 0.5 }
                          }
                        }} />
                      </Box>
                      
                      {/* Progress Bar */}
                      <Box sx={{ mt: 4, width: '300px', maxWidth: '90vw' }}>
                        <LinearProgress
                          sx={{
                            height: '4px',
                            borderRadius: '2px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: `linear-gradient(90deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
                              borderRadius: '2px',
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  }>
                    <NavBar navLinks={navLinks} />
                    <Box
                      component="main"
                      sx={{
                        minHeight: "100vh",
                        pt: { xs: '56px', md: '64px' }, // Add top padding for fixed navbar
                        pb: 4,
                      }}
                    >
                      {children}
                    </Box>
                    <Footer />
                  </Suspense>
                </Box>
                </CustomThemeProvider>
              </StoreProvider>
            </ReduxProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
