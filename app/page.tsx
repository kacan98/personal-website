import { Box } from "@mui/material";
import SocialIcons from "@/components/home/socialIcons";
import FullScreenPicture from "@/components/home/fullScreenPicture";
import HomeText from "@/components/home/homeText";
import { getSettings } from "@/sanity/sanity-utils";

export default async function App() {
  const settings = await getSettings();
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          position: "relative",
        }}
      >
        <FullScreenPicture sanityImage={settings.mainPage?.mainImage} />
        <HomeText
          title={settings.mainPage?.title}
          subtitles={settings.mainPage?.subtitles}
        />
        <SocialIcons direction={"column"} />
      </Box>
    </>
  );
}
