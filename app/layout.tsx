import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import { CssBaseline, Skeleton } from "@mui/material";
import TopBar from "@/components/menu/topBar";
import PortfolioPage from "@/components/pages/portfolio/portfolioPage";
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
  metadata = settings.metadata;

  const pages = galleries.map((gallery) => ({
    name: gallery.title,
    page: <GalleryPage {...gallery} />,
  }));

  const { portfolio, chatbot, cv } = settings.specialPages || {};

  if (portfolio) {
    pages.unshift({
      name: "Portfolio",
      page: <PortfolioPage />,
    });
  }

  if (chatbot) {
    pages.unshift({
      name: "Chatbot",
      page: <ChatbotPage />,
    });
  }

  if (cv) {
    pages.unshift({
      name: "CV",
      page: <KarelCv />,
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
              <TopBar pages={pages} />
            </Suspense>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
