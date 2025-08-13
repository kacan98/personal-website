import "@/app/app.css";
import BackgroundEffect from "@/components/layout/BackgroundEffect";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/menu/navBar";
import CustomThemeProvider from "@/components/theme/customThemeProvider";
import ReduxProvider from "@/components/providers/ReduxProvider";
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
import { Box, CssBaseline, LinearProgress } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
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

  console.log("Layout navLinks:", navLinks); return (
    <html lang="en" style={{ height: '100%' }}>
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
                    right: 0,
                    padding: 2,
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <LinearProgress
                      sx={{
                        width: '200px',
                        borderRadius: 1,
                        '& .MuiLinearProgress-bar': {
                          backgroundImage: 'linear-gradient(to right, #f59e0b, #fde68a, #f59e0b)',
                        }
                      }}
                    />
                  </Box>
                }>
                  <NavBar navLinks={navLinks} />
                  <Box
                    component="main"
                    sx={{
                      minHeight: "calc(100vh - 64px)", // Subtract navbar height
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
