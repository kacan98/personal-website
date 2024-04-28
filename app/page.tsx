import { Box } from "@mui/material";
import TopBar from "@/components/menu/topBar";
import SocialIcons from "@/components/home/socialIcons";
import FullScreenPicture from "@/components/home/fullScreenPicture";
import PortfolioPage from "@/components/pages/portfolio/portfolioPage";
import KarelCv from "@/components/pages/cv/karelCv";
import HomeText from "@/components/home/homeText";
import ChatbotPage from "@/components/pages/chatbot/chatbotPage";

export default function App() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <FullScreenPicture />
      <TopBar
        pages={[
          {
            buttonName: "Portfolio",
            page: <PortfolioPage />,
          },
          {
            buttonName: "CV",
            page: <KarelCv />,
          },
          {
            buttonName: "Chatbot",
            page: <ChatbotPage />,
          },
        ]}
      />
      <HomeText />
      <SocialIcons direction={"column"} />
    </Box>
  );
}
