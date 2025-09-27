import "@/app/app.css";
import BackgroundEffect from "@/components/layout/BackgroundEffect";
import Footer from "@/components/layout/Footer";
import NavBar from "@/components/menu/navBar";
import CustomThemeProvider from "@/components/theme/customThemeProvider";
import { BRAND_COLORS } from "../colors";
import {
  getCvSettings,
  getGalleries,
  getSettings,
} from "@/data";
import "@fontsource/cormorant-garamond";
import "@fontsource/open-sans";
import "@fontsource/urbanist";
import "@fontsource/yeseva-one";
import { Box, CssBaseline, LinearProgress, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { Suspense } from "react";
import StoreProvider from "../StoreProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthProvider } from '@/contexts/AuthContext';
import { CASE_STUDIES_PATH } from '@/lib/routes';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Generate static params for supported locales
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Karel Čančara - AI-Enhanced Full-Stack Developer",
    description: "Full-Stack Developer specializing in TypeScript, React, .NET, and AI-enhanced development. Building enterprise solutions for 100+ companies.",
  };
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as never)) notFound();
  
  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  const settings = getSettings();
  const _galleriesData = getGalleries();
  const cvSettings = getCvSettings(locale);

  const tNav = await getTranslations('navigation');
  
  const navigationLinks = [
    { name: tNav('about'), href: `/${locale}/about` },
    { name: tNav('projects'), href: `/${locale}/portfolio` },
    { name: tNav('cv'), href: `/${locale}/cv` },
    { name: tNav('blog'), href: `/${locale}${CASE_STUDIES_PATH}` },
  ];

  if (settings?.specialPages?.chatbot) {
    navigationLinks.push({ name: tNav('chatbot'), href: `/${locale}/chatbot` });
  }

  return (
    <AppRouterCacheProvider options={{ key: 'mui', enableCssLayer: true }}>
      <NextIntlClientProvider messages={messages}>
        <AuthProvider>
          <StoreProvider cvConfig={cvSettings}>
            <CustomThemeProvider>
            <CssBaseline />
            <NavBar navLinks={navigationLinks} />
            <BackgroundEffect />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: "transparent",
                position: "relative",
                zIndex: 2,
                pt: { xs: 7, md: 8 },
              }}
            >
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "50vh",
                        gap: 2,
                      }}
                    >
                      <LinearProgress
                        sx={{
                          width: "200px",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: BRAND_COLORS.accent,
                          },
                          backgroundColor: "rgba(255,255,255,0.1)",
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Loading...
                      </Typography>
                    </Box>
                  }
                >
                  {children}
                </Suspense>
              </Box>
              <Footer />
            </Box>
            </CustomThemeProvider>
          </StoreProvider>
        </AuthProvider>
      </NextIntlClientProvider>
    </AppRouterCacheProvider>
  );
}