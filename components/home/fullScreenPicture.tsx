import React from "react";
import Image from "next/image";
import { Box } from "@mui/material";

function FullScreenPicture() {
  return (
    <>
      <Image
        src="/færøerne_karel.jpg"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)",
        }}
      />
    </>
  );
}

export default FullScreenPicture;
