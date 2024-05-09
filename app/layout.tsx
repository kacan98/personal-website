import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import { CssBaseline, Skeleton } from "@mui/material";
import TopBar from "@/components/menu/topBar";
import KarelCv from "@/components/pages/cv/karelCv";
import ChatbotPage from "@/components/pages/chatbot/chatbotPage";
import GalleryPage from "@/components/pages/galery/galleryPage";
import { getGalleries, getSettings } from "@/sanity/sanity-utils";
import { Suspense } from "react";

export let metadata: Metadata = {};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const galleries = await getGalleries();
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

  const { chatbot, cv } = settings?.specialPages || {};

  if (chatbot) {
    modals.unshift({
      name: "Chatbot",
      modal: <ChatbotPage />,
    });
  }

  if (cv) {
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
          <ThemeProvider theme={theme}>
            {/*Had to be in Suspense because of useSearchParams inside */}
            <Suspense fallback={<Skeleton />}>
              <TopBar modals={modals} />
            </Suspense>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
