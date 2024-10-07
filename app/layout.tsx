import "@/app/app.css";
import NavBar from "@/components/menu/navBar";
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
import "@fontsource-variable/open-sans";
import "@fontsource/cormorant-garamond";
import "@fontsource/yeseva-one";
import { CssBaseline, Skeleton } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import { Suspense } from "react";
import StoreProvider from "./StoreProvider";

export let metadata: Metadata = {};

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
    modals.unshift({
      name: "Chatbot",
      modal: <ChatbotPage />,
    });
  }

  if (cvSettings.on) {
    modals.unshift({
      name: "CV",
      modal: (
        <CvPage />
      ),
    });
  }

  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <AppRouterCacheProvider>
          <StoreProvider cvSettings={cvSettings}>
            <CustomThemeProvider styles={styles}>
              {/*Had to be in Suspense because of useSearchParams inside */}
              <Suspense fallback={<Skeleton />}>
                <NavBar modals={modals} />
              </Suspense>
              {children}
            </CustomThemeProvider>
          </StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
