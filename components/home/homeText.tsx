import React from "react";
import { Box, Typography } from "@mui/material";
import AnimatedText from "@/components/home/springingText";

function HomeText() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: "100%",
        height: "80%",
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
  );
}

export default HomeText;
