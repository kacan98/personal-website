"use client";

import { useState, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  LinearProgress,
  Container,
} from "@mui/material";
import { CloudUpload, Download, Delete } from "@mui/icons-material";
import PageWrapper from "../pageWrapper";
import { BRAND_COLORS } from "@/app/colors";
import { useRemoveBackground } from "../hooks/useRemoveBackground";

type BackgroundRemovalPageContentProps = {
  title: string;
  locale: string;
};

export default function BackgroundRemovalPageContent({
  title,
}: BackgroundRemovalPageContentProps) {
  const [originalImage, setOriginalImage] = useState<string>("");
  const [processedImage, setProcessedImage] = useState<string>("");
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    removingBackground: processing,
    backgroundRemovalStatus: status,
    backgroundRemovalProgress: progress,
    removeBackgroundFromImage,
  } = useRemoveBackground();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setImageInfo({
            width: img.width,
            height: img.height,
            size: file.size,
          });
        };
        img.src = imageData;

        setOriginalImage(imageData);
        setProcessedImage("");
        // Auto-start removal after image loads
        setTimeout(() => processImage(imageData), 100);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setImageInfo({
            width: img.width,
            height: img.height,
            size: file.size,
          });
        };
        img.src = imageData;

        setOriginalImage(imageData);
        setProcessedImage("");
        // Auto-start removal after image loads
        setTimeout(() => processImage(imageData), 100);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const processImage = async (imageData: string) => {
    if (!imageData) return;

    const result = await removeBackgroundFromImage(imageData);
    if (result) {
      setProcessedImage(result);
    } else {
      alert("Failed to remove background. Please try again.");
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "background-removed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setOriginalImage("");
    setProcessedImage("");
    setImageInfo(null);
  };

  return (
    <PageWrapper title={title}>
      <Container maxWidth="lg">
        <Typography
          variant="body1"
          sx={{
            color: BRAND_COLORS.primary,
            mb: 4,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Remove backgrounds from images using AI. Works 100% in your browser - no uploads,
          completely private and free.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>
          {/* Upload Section */}
          <Box sx={{ flex: 1 }}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: BRAND_COLORS.dark,
                border: `1px solid ${BRAND_COLORS.secondary}40`,
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: BRAND_COLORS.primary, fontWeight: 600 }}
              >
                Upload Image
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                  mb: 3,
                  p: 4,
                  border: `2px dashed ${BRAND_COLORS.secondary}60`,
                  borderRadius: 1,
                  textAlign: "center",
                  cursor: "pointer",
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { borderColor: BRAND_COLORS.accent },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {originalImage ? (
                  <Box sx={{ position: "relative", maxWidth: "100%" }}>
                    <img
                      src={originalImage}
                      alt="Original"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        borderRadius: "4px",
                        opacity: processing ? 0.5 : 1,
                      }}
                    />
                  </Box>
                ) : (
                  <>
                    <CloudUpload sx={{ fontSize: 60, color: BRAND_COLORS.secondary, mb: 2 }} />
                    <Typography variant="h6" sx={{ color: BRAND_COLORS.primary, mb: 1 }}>
                      Drop image here or click to upload
                    </Typography>
                    <Typography variant="body2" sx={{ color: BRAND_COLORS.secondary }}>
                      Supports JPG, PNG, WebP
                    </Typography>
                  </>
                )}
              </Box>

              {imageInfo && !processing && (
                <Box sx={{ mb: 2, textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: BRAND_COLORS.secondary }}>
                    {imageInfo.width} × {imageInfo.height} px • {(imageInfo.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>
              )}

              {processing && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: BRAND_COLORS.primary,
                      display: "block",
                      mb: 1,
                      textAlign: "center",
                    }}
                  >
                    {status}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: `${BRAND_COLORS.secondary}40`,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: BRAND_COLORS.accent,
                      },
                    }}
                  />
                </Box>
              )}

              {(originalImage || processedImage) && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={handleClear}
                    disabled={processing}
                    sx={{
                      borderColor: BRAND_COLORS.secondary,
                      color: BRAND_COLORS.secondary,
                      "&:hover": {
                        borderColor: BRAND_COLORS.accent,
                        backgroundColor: `${BRAND_COLORS.accent}20`,
                      },
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              )}

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: `${BRAND_COLORS.secondary}10`,
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" sx={{ color: BRAND_COLORS.secondary }}>
                  <strong>Privacy:</strong> All processing happens in your browser. No images are
                  uploaded to any server. The AI model downloads once (~50MB) and is cached for
                  future use.
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Result Section */}
          <Box sx={{ flex: 1 }}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: BRAND_COLORS.dark,
                border: `1px solid ${BRAND_COLORS.secondary}40`,
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: BRAND_COLORS.primary, fontWeight: 600 }}
              >
                Result
              </Typography>

              <Box
                sx={{
                  mb: 3,
                  p: 4,
                  border: `1px solid ${BRAND_COLORS.secondary}40`,
                  borderRadius: 1,
                  minHeight: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                  backgroundImage:
                    "linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 10px 10px",
                }}
              >
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ color: "#666666" }}>
                    Processed image will appear here
                  </Typography>
                )}
              </Box>

              {processedImage && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Download />}
                  onClick={handleDownload}
                  sx={{
                    backgroundColor: BRAND_COLORS.accent,
                    "&:hover": { backgroundColor: BRAND_COLORS.accent + "dd" },
                  }}
                >
                  Download Image
                </Button>
              )}
            </Paper>
          </Box>
        </Box>
      </Container>
    </PageWrapper>
  );
}
