"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Stack, Button, Paper } from "@mui/material";
import { LightMode, DarkMode, ContentCopy } from "@mui/icons-material";
import { BRAND_COLORS } from "@/app/colors";
import type { SignatureData } from "./types";
import { generateSignatureHTML } from "./generateSignatureHTML";

type SignaturePreviewProps = {
  signatureData: SignatureData;
  onCopy: () => void;
};

export default function SignaturePreview({ signatureData, onCopy }: SignaturePreviewProps) {
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');

  return (
    <Paper
      sx={{
        position: { xs: "relative", lg: "sticky" },
        top: { lg: 20 },
        p: 0,
        backgroundColor: "#f5f5f5",
        border: `1px solid ${BRAND_COLORS.secondary}40`,
        overflow: "clip",
        maxHeight: { lg: "calc(100vh - 40px)" },
        height: { xs: "auto", lg: "100%" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" sx={{ color: "#333", fontSize: 16, textAlign: "left" }}>
              Preview
            </Typography>
            <Typography variant="caption" sx={{ color: "#666", textAlign: "left" }}>
              This is how your signature will appear in emails
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => setPreviewMode('light')}
              sx={{
                backgroundColor: previewMode === 'light' ? BRAND_COLORS.accent + '20' : 'transparent',
                color: previewMode === 'light' ? BRAND_COLORS.accent : '#666',
                '&:hover': {
                  backgroundColor: BRAND_COLORS.accent + '30',
                },
              }}
            >
              <LightMode fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setPreviewMode('dark')}
              sx={{
                backgroundColor: previewMode === 'dark' ? BRAND_COLORS.accent + '20' : 'transparent',
                color: previewMode === 'dark' ? BRAND_COLORS.accent : '#666',
                '&:hover': {
                  backgroundColor: BRAND_COLORS.accent + '30',
                },
              }}
            >
              <DarkMode fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Preview Content */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          backgroundColor: previewMode === 'light' ? "#ffffff" : "#1F1F1F",
          overflow: "auto",
          maxHeight: { xs: "500px", lg: "none" },
        }}
      >
        <Box
          sx={{
            p: 3,
            border: previewMode === 'light' ? "1px solid #e0e0e0" : "1px solid #3a3a3a",
            borderRadius: 1,
            backgroundColor: previewMode === 'light' ? "#fafafa" : "#2a2a2a",
            mb: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: previewMode === 'light' ? "#666" : "#cccccc", mb: 2, textAlign: "left" }}>
            Hi there,
          </Typography>
          <Typography variant="body2" sx={{ color: previewMode === 'light' ? "#666" : "#cccccc", mb: 3, textAlign: "left" }}>
            This is a sample email to show how your signature looks.
          </Typography>
          <Box
            sx={{ textAlign: "left" }}
            dangerouslySetInnerHTML={{
              __html: generateSignatureHTML(signatureData, { assetBaseUrl: "" }).replace(
                /<\!DOCTYPE.*?<body[^>]*>/s,
                ""
              ).replace(/<\/body>.*$/s, ""),
            }}
          />
        </Box>
      </Box>

      {/* Footer with Copy Button */}
      <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", backgroundColor: "#ffffff" }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<ContentCopy />}
          onClick={onCopy}
          sx={{
            backgroundColor: BRAND_COLORS.accent,
            "&:hover": {
              backgroundColor: `${BRAND_COLORS.accent}dd`,
            },
          }}
        >
          Copy Signature
        </Button>
      </Box>
    </Paper>
  );
}
