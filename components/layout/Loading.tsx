"use client";
import { Box, Typography, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";

const loadingMessages = [
  "Initializing system...",
  "Loading components...",
  "Fetching data...",
  "Rendering interface...",
  "Compiling assets...",
  "Mounting components...",
  "Optimizing performance...",
  "Almost ready..."
];

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 400);

    // Simple progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 3;
      });
    }, 100);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        position: "relative",
        opacity: 1,
      }}
    >
      {/* Windows 11-style loading */}
      <Box
        sx={{
          border: "1px solid rgba(120, 120, 120, 0.3)",
          borderRadius: "8px",
          p: 4,
          minWidth: 400,
          backgroundColor: "rgba(32, 32, 32, 0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Windows 11 header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            pb: 2,
            borderBottom: "1px solid rgba(120, 120, 120, 0.2)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 500,
            }}
          >
            Windows PowerShell
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            {/* Windows minimize button */}
            <Box
              sx={{
                width: "14px",
                height: "1px",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            />
            {/* Windows maximize button */}
            <Box
              sx={{
                width: "12px",
                height: "12px",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            />
            {/* Windows close button */}
            <Box
              sx={{
                width: "12px",
                height: "12px",
                position: "relative",
                cursor: "pointer",
                "&:before, &:after": {
                  content: '""',
                  position: "absolute",
                  width: "12px",
                  height: "1px",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  top: "50%",
                  left: 0,
                },
                "&:before": {
                  transform: "rotate(45deg)",
                },
                "&:after": {
                  transform: "rotate(-45deg)",
                },
                "&:hover": {
                  "&:before, &:after": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                  },
                },
              }}
            />
          </Box>
        </Box>
        
        {/* Command prompt style */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "Consolas, monospace",
              fontSize: "14px",
            }}
          >
            PS C:\Users\Karel\Portfolio&gt;
          </Typography>
        </Box>

        {/* Loading message */}
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Consolas, monospace",
            color: "#00d4ff", // Windows blue accent color
            mb: 3,
            minHeight: "1.5em",
            fontSize: "16px",
          }}
        >
          {loadingMessages[messageIndex]}
          <Box
            component="span"
            sx={{
              animation: "blink 1s infinite",
              "@keyframes blink": {
                "0%, 50%": { opacity: 1 },
                "51%, 100%": { opacity: 0 },
              },
              color: "rgba(255, 255, 255, 0.8)",
              ml: 0.5,
            }}
          >
            _
          </Box>
        </Typography>

        {/* Windows 11 style progress bar */}
        <LinearProgress
          variant="determinate"
          value={Math.round(progress)} // Always show actual progress including 100%
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: "rgba(120, 120, 120, 0.3)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "secondary.main", // Use theme gold color
              borderRadius: 2,
              transition: "transform 0.2s ease",
            },
          }}
        />

        {/* Loading percentage */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "right",
            mt: 2,
            fontFamily: "Consolas, monospace",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "13px",
          }}
        >
          {Math.round(progress)}% complete
        </Typography>
      </Box>
    </Box>
  );
}