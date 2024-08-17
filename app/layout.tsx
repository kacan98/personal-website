import "@/app/app.css";
import TopBar from "@/components/menu/topBar";
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
        <CvPage
          name={cvSettings.name}
          intro={cvSettings.subtitle}
          mainSection={cvSettings.mainColumn}
          sideSection={cvSettings.sideColumn}
        />
      ),
    });
  }

  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <AppRouterCacheProvider>
          <CustomThemeProvider styles={styles}>
            {/*Had to be in Suspense because of useSearchParams inside */}
            <Suspense fallback={<Skeleton />}>
              <TopBar modals={modals} />
            </Suspense>
            {children}
          </CustomThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
