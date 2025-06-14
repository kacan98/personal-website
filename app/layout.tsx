import "@/app/app.css";
import BackgroundEffect from "@/components/layout/BackgroundEffect";
import NavBar from "@/components/menu/navBar";
import About from "@/components/pages/about/about";
import ChatbotPage from "@/components/pages/chatbot/chatbotPage";
import CvPage from "@/components/pages/cv/cvPage";
import GalleryPage from "@/components/pages/galery/galleryPage";
import CustomThemeProvider from "@/components/theme/customThemeProvider";
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

export let metadata: Metadata = {};

const aboutMeText = `Hi, I’m Karel — a full stack developer with a frontend focus, growing backend experience, and a background in marketing. I work mainly with TypeScript, Angular, React, and C#, and I enjoy building products that make sense to real users.

I got into development by teaching myself how things work and haven’t stopped since. These days, I work across the stack on enterprise software and contribute to both frontend and backend codebases. I’m known for being curious, user-focused, and easy to work with.

Always open to new challenges and chances to learn something new.`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const styles = await getStyles();
  const settings = await getSettings();
  const galleries = await getGalleries();
  const cvSettings = await getCvSettings();
  metadata = settings?.metadata || {
    title: "Portfolio",
    description: "Portfolio",
  };

  const modals: { name: string; modal: React.ReactNode }[] = [];
  modals.push(
    ...galleries.map((gallery) => ({
      name: gallery.title,
      modal: <GalleryPage {...gallery} />,
    }))
  );

  const { chatbot } = settings?.specialPages || {};

  if (chatbot) {
    modals.push({
      name: "Chatbot",
      modal: <ChatbotPage />,
    });
  }

  if (cvSettings.on) {
    modals.push({
      name: "Resume",
      modal: <CvPage />,
    });
  }

  modals.push({
    name: "About",
    modal: (
      <About
        heading={"About me"}
        bodyContent={aboutMeText}
        buttonText="Shoot me a message"
        buttonHref="mailto:karel.cancara@gmail.com"
      />
    ),
  }); return (
    <html lang="en">
      <body>
        <CssBaseline />
        <AppRouterCacheProvider>
          <StoreProvider cvSettings={cvSettings}>
            <CustomThemeProvider styles={styles}>
              <div
                style={{
                  position: "relative",
                  minHeight: "100vh",
                  backgroundColor: "#0f172a",
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
                  <NavBar modals={modals} />
                  {children}
                </Suspense>
              </div>
            </CustomThemeProvider>
          </StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
