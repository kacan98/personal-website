"use client";
import { Box, Typography, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { BRAND_COLORS, BACKGROUND_COLORS } from "@/app/colors";
import { useTranslations } from 'next-intl';

interface LoadingProps {
  messages?: string[];
  terminal?: string;
  loadingAssets?: string;
}

export default function Loading({ 
  messages,
  terminal,
  loadingAssets
}: LoadingProps = {}) {
  const t = useTranslations('loading');
  
  const loadingMessages = messages || [
    t('messages.0'),
    t('messages.1'), 
    t('messages.2'),
    t('messages.3'),
    t('messages.4'),
    t('messages.5'),
    t('messages.6'),
    t('messages.7'),
    t('messages.8')
  ];

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
        return Math.min(100, prev + Math.random() * 2.5);
      });
    }, 120);

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
        backgroundColor: BACKGROUND_COLORS.primary,
        color: "white",
        position: "relative",
        opacity: 1,
      }}
    >
      {/* Windows 11-style loading */}
      <Box
        sx={{
          borderRadius: 3,
          p: 4,
          minWidth: { xs: '90vw', sm: 500 },
          maxWidth: '600px',
          background: `linear-gradient(135deg, ${BACKGROUND_COLORS.surface} 0%, ${BACKGROUND_COLORS.primary} 100%)`,
          backdropFilter: "blur(20px)",
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(${BRAND_COLORS.primaryRgb}, 0.1)`,
          border: `1px solid ${BRAND_COLORS.secondary}40`,
          transition: 'all 0.3s ease',
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
            borderBottom: `1px solid ${BRAND_COLORS.secondary}40`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: BRAND_COLORS.primary,
              boxShadow: `0 0 8px rgba(${BRAND_COLORS.primaryRgb}, 0.5)`
            }} />
            <Typography
              variant="body2"
              sx={{
                color: BRAND_COLORS.primary,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 600,
                fontSize: '15px'
              }}
            >
              {terminal || t('terminal')}
            </Typography>
          </Box>
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
                backgroundColor: `${BRAND_COLORS.primary}99`,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: `${BRAND_COLORS.primary}CC`,
                },
              }}
            />
            {/* Windows maximize button */}
            <Box
              sx={{
                width: "12px",
                height: "12px",
                border: `1px solid ${BRAND_COLORS.primary}99`,
                cursor: "pointer",
                "&:hover": {
                  borderColor: `${BRAND_COLORS.primary}CC`,
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
                  backgroundColor: `${BRAND_COLORS.primary}99`,
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
                    backgroundColor: `${BRAND_COLORS.primary}CC`,
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
              color: `${BRAND_COLORS.primary}B3`,
              fontFamily: "Consolas, monospace",
              fontSize: "14px",
            }}
          >
            C:\Users\Karel\Portfolio&gt;
          </Typography>
        </Box>

        {/* Loading message */}
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Consolas, monospace",
            color: BRAND_COLORS.primary,
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
              color: `${BRAND_COLORS.primary}CC`,
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
            backgroundColor: `${BACKGROUND_COLORS.surface}40`,
            "& .MuiLinearProgress-bar": {
              background: `linear-gradient(90deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary})`,
              borderRadius: 2,
              transition: "transform 0.2s ease",
              boxShadow: `0 0 8px rgba(${BRAND_COLORS.primaryRgb}, 0.3)`,
            },
          }}
        />

        {/* Loading percentage and stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Consolas, monospace",
              color: `${BRAND_COLORS.primary}99`,
              fontSize: "12px",
            }}
          >
            {loadingAssets || t('loadingAssets')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Consolas, monospace",
              color: BRAND_COLORS.secondary,
              fontSize: "13px",
              fontWeight: 600
            }}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}