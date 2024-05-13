"use client";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { getUserPicture } from "@/sanity/sanity-utils";
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/sanity/lib/sanityClient";
import { Image } from "sanity";

type MessageProps = {
  chatRole: "user" | "assistant";
  text: string | null;
};

export default function Message({ chatRole, text }: MessageProps) {
  const [userPicture, setUserPicture] = useState<Image | null>(null);

  useEffect(() => {
    const fetchUserPicture = async () => {
      const picture = await getUserPicture();
      setUserPicture(picture);
    };

    fetchUserPicture();
  }, []);

  const urlFor = useCallback((source: Image) => {
    const builder = imageUrlBuilder(sanityClient);
    return builder.image(source);
  }, []);

  const AvatarPicture = (
    <Avatar
      alt={`${chatRole} avatar`}
      src={
        chatRole === "assistant"
          ? (userPicture && urlFor(userPicture).url()) ?? "/færøerne_karel.jpg"
          : "user.png"
      }
      sx={{ width: 50, height: 50, marginBottom: "15px", margin: 2 }}
    />
  );
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: chatRole === "assistant" ? "flex-start" : "flex-end",
        mb: 2,
      }}
    >
      {chatRole === "assistant" && AvatarPicture}
      <Card
        color={chatRole === "user" ? "primary" : "secondary"}
        sx={{
          maxWidth: 345,
          textAlign: chatRole === "assistant" ? "left" : "right",
        }}
      >
        <CardContent>
          {text ? (
            <Typography variant="body1">{text}</Typography>
          ) : (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={300}
                  height={20}
                  sx={{
                    mb: 1,
                  }}
                />
              ))}
            </>
          )}
        </CardContent>
      </Card>
      {chatRole === "user" && AvatarPicture}
    </Box>
  );
}
