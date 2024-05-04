import React from "react";
import { Box, Typography } from "@mui/material";
import AnimatedText from "@/components/home/springingText";

type HomeTextProps = {
  title?: string;
  subtitles?: string[];
};

function HomeText({ title, subtitles }: HomeTextProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: "100%",
        height: "80%",
        opacity: 0.65,
        flexDirection: "column",
        padding: 3,
      }}
    >
      {title && (
        <Box>
          <Typography textAlign={"center"} variant={"h1"}>
            {title}
          </Typography>
        </Box>
      )}
      {subtitles && (
        <Box sx={{ opacity: 0.7 }}>
          <AnimatedText texts={subtitles} />
        </Box>
      )}
      {/*TODO: Add those?*/}
      {/*<ButtonGroup*/}
      {/*  sx={{*/}
      {/*    margin: "20px",*/}
      {/*  }}*/}
      {/*  size={"large"}*/}
      {/*>*/}
      {/*  <Button variant={"contained"}>Contact me</Button>*/}
      {/*  <Button variant={"outlined"}>Portfolio</Button>*/}
      {/*</ButtonGroup>*/}
    </Box>
  );
}

export default HomeText;
