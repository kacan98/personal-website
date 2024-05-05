import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import { CssBaseline } from "@mui/material";
import TopBar from "@/components/menu/topBar";
import PortfolioPage from "@/components/pages/portfolio/portfolioPage";
import KarelCv from "@/components/pages/cv/karelCv";
import ChatbotPage from "@/components/pages/chatbot/chatbotPage";

export const metadata: Metadata = {
  title: "Karel Čančara",
  description: "Frontend Developer's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <TopBar
              pages={[
                {
                  name: "Portfolio",
                  page: <PortfolioPage />,
                },
                {
                  name: "CV",
                  page: <KarelCv />,
                },
                {
                  name: "Chatbot",
                  page: <ChatbotPage />,
                },
              ]}
            />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
