import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline, Skeleton } from "@mui/material";
import TopBar from "@/components/menu/topBar";
import KarelCv from "@/components/pages/cv/karelCv";
import ChatbotPage from "@/components/pages/chatbot/chatbotPage";
import GalleryPage from "@/components/pages/galery/galleryPage";
import {
  getCvSettings,
  getGalleries,
  getSettings,
  getStyles,
} from "@/sanity/sanity-utils";
import { Suspense } from "react";
import "@/app/app.css";
import CustomThemeProvider from "@/app/theme/customThemeProvider";
import "@fontsource/yeseva-one";
import "@fontsource/cormorant-garamond";
import "@fontsource-variable/open-sans";

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
    })),
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
      modal: <KarelCv />,
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
