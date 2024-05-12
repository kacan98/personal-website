"use client";
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
      sx={(theme) => ({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "100%",
        opacity: theme.palette.mode === "light" ? 0.9 : 0.7,
        flexDirection: "column",
        fontSize: "2rem",
        color: "text.primary",
      })}
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
