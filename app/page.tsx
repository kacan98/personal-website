import { Box } from "@mui/material";
import TopBar from "@/components/menu/topBar";
import SocialIcons from "@/components/home/socialIcons";
import FullScreenPicture from "@/components/home/fullScreenPicture";
import PortfolioPage from "@/components/pages/portfolio/portfolioPage";
import KarelCv from "@/components/pages/portfolio/cv/karelCv";
import HomeText from "@/components/home/homeText";

export default function App() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
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
        ]}
      />
      <HomeText />
      <SocialIcons direction={"column"} />
    </Box>
  );
}
