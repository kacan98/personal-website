"use client";
import React from "react";
import { Box, Theme } from "@mui/material";
import Image from "next/image";

type FullScreenPictureProps = {
  imagePath?: string;
};

function FullScreenPicture({ imagePath }: FullScreenPictureProps) {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >
        {imagePath && (
          <Image
            src={imagePath}
            alt="Background Image"
            fill
            style={{ objectFit: "cover" }}
          />
        )}
      </Box>
      <Box
        sx={(theme: Theme) => ({
          position: "relative",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.35)"
              : "radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)",
        })}
      ></Box>
    </>
  );
}

export default FullScreenPicture;
