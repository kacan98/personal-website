"use client";
import React from "react";
import { Box } from "@mui/material";
import { Image as SanityImage } from "sanity";
import SanityPicture from "@/components/sanityPicture";

type FullScreenPictureProps = {
  sanityImage?: SanityImage;
};

function FullScreenPicture({ sanityImage }: FullScreenPictureProps) {
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
        {sanityImage && (
          <SanityPicture
            sanityImage={sanityImage}
            alt="Background Image"
            objectFit="cover"
            fill
          />
        )}
      </Box>
      <Box
        sx={(theme) => ({
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
