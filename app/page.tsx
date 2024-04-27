import { Box, Typography } from "@mui/material";
import TopBar from "@/components/topBar";
import SocialIcons from "@/components/socialIcons";
import FullScreenPicture from "@/components/fullScreenPicture";
import AnimatedText from "@/components/springingText";

export default function MuiPage() {
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
      <TopBar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: "100%",
          height: "60%",
          opacity: 0.7,
          flexDirection: "column",
        }}
      >
        <Box>
          <Typography textAlign={"center"} variant={"h1"}>
            Karel Čančara
          </Typography>
        </Box>
        <Box>
          <AnimatedText
            texts={[
              "Frontend developer",
              "Web Developer",
              "Angular Developer",
              "React Developer",
              "Scum Master",
            ]}
          />
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          p: 2,
        }}
      >
        <SocialIcons direction={"column"} />
      </Box>
    </Box>
  );
}
