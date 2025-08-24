"use client";
import { usePicture } from "@/hooks/usePicture";
import { getCVPicture } from "@/data-utils";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";

type MessageProps = {
  chatRole: "user" | "assistant";
  text: string | null;
};

export default function Message({ chatRole, text }: MessageProps) {
  const {imageUrl} = usePicture(getCVPicture);

  const AvatarPicture = (
    <Avatar
      alt={`${chatRole} avatar`}
      src={
        chatRole === "assistant"
          ? (imageUrl) ?? ""
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
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={index === 0 ? 280 : 200}
                  height={18}
                  animation="wave"
                  sx={{
                    mb: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&::after': {
                      background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1), transparent)',
                    },
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
