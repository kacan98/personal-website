import {
  Avatar,
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";

type MessageProps = {
  chatRole: "user" | "assistant";
  text: string | null;
};

const Message = ({ chatRole, text }: MessageProps) => {
  const AvatarPicture = (
    <Avatar
      alt={`${chatRole} avatar`}
      src={chatRole === "assistant" ? "/færøerne_karel.jpg" : "user.png"} //TODO: Make this generic
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
};

export default Message;
