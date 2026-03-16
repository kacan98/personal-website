"use client";

import { useState, useRef } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  LinearProgress,
  Slider,
} from "@mui/material";
import { CloudUpload, Delete, Edit, Download } from "@mui/icons-material";
import { BRAND_COLORS } from "@/app/colors";
import { useRemoveBackground } from "../hooks/useRemoveBackground";

type ImageUploadProps = {
  label: string;
  image: string;
  onImageChange: (image: string) => void;
  showRemoveBackground?: boolean;
  showCropButton?: boolean;
  onCropClick?: () => void;
  showDownloadButton?: boolean;
  maxWidth?: string;
  maxHeight?: string;
  showSizeSelector?: boolean;
  imageSize?: number;
  onImageSizeChange?: (size: number) => void;
};

export default function ImageUpload({
  label,
  image,
  onImageChange,
  showRemoveBackground = false,
  showCropButton = false,
  onCropClick,
  showDownloadButton = true,
  maxWidth = "200px",
  maxHeight = "200px",
  showSizeSelector = false,
  imageSize = 80,
  onImageSizeChange,
}: ImageUploadProps) {
  const [backgroundRemoved, setBackgroundRemoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localImageSize, setLocalImageSize] = useState(imageSize);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    removingBackground,
    backgroundRemovalStatus,
    backgroundRemovalProgress,
    backgroundRemovalError,
    removeBackgroundFromImage,
  } = useRemoveBackground();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
        setBackgroundRemoved(false); // Reset when new image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
        setBackgroundRemoved(false); // Reset when new image is dropped
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    onImageChange("");
    setBackgroundRemoved(false); // Reset when image is removed
  };

  const handleDownloadImage = () => {
    if (!image) return;

    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = image;
    link.download = `image-no-background-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveBackground = async () => {
    if (!image) return;

    const result = await removeBackgroundFromImage(image);
    if (result) {
      onImageChange(result);
      setBackgroundRemoved(true);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2, color: BRAND_COLORS.primary }}>
        {label}
      </Typography>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

      {!image ? (
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            p: 4,
            border: `2px dashed ${isDragging ? BRAND_COLORS.accent : BRAND_COLORS.secondary + '60'}`,
            borderRadius: 1,
            textAlign: "center",
            cursor: "pointer",
            minHeight: 150,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDragging ? `${BRAND_COLORS.accent}10` : 'transparent',
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: BRAND_COLORS.accent,
              backgroundColor: `${BRAND_COLORS.accent}10`,
            },
          }}
        >
          <CloudUpload sx={{
            fontSize: 48,
            color: isDragging ? BRAND_COLORS.accent : BRAND_COLORS.secondary,
            mb: 1,
            transition: "color 0.2s ease",
          }} />
          <Typography variant="body2" sx={{
            color: isDragging ? BRAND_COLORS.accent : BRAND_COLORS.primary,
            transition: "color 0.2s ease",
          }}>
            {isDragging ? "Drop to upload" : "Drop image here or click to upload"}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              p: 3,
              border: `2px solid ${BRAND_COLORS.secondary}40`,
              borderRadius: 1,
              textAlign: "center",
              mb: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                cursor: showCropButton && onCropClick && !removingBackground ? "pointer" : "default",
              }}
              onClick={() => {
                if (showCropButton && onCropClick && !removingBackground) {
                  onCropClick();
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Uploaded"
                style={{
                  maxWidth: maxWidth,
                  maxHeight: maxHeight,
                  objectFit: "contain",
                  opacity: removingBackground ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              />
              {showCropButton && onCropClick && !removingBackground && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    "&:hover": {
                      opacity: 1,
                      backgroundColor: `${BRAND_COLORS.dark}99`,
                    },
                  }}
                >
                  <Edit
                    sx={{
                      fontSize: 48,
                      color: BRAND_COLORS.primary,
                    }}
                  />
                </Box>
              )}
              {removingBackground && (
                <CircularProgress
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-20px",
                    marginLeft: "-20px",
                    color: BRAND_COLORS.accent,
                  }}
                />
              )}
            </Box>

            {removingBackground && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ color: BRAND_COLORS.primary, display: "block", mb: 1, textAlign: "center" }}
                >
                  {backgroundRemovalStatus}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={backgroundRemovalProgress}
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
          </Box>

          {backgroundRemovalError && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: `#ff000020`, borderRadius: 1, border: "1px solid #ff0000" }}>
              <Typography variant="caption" sx={{ color: "#ff6666", display: "block" }}>
                {backgroundRemovalError}
              </Typography>
            </Box>
          )}

          {showSizeSelector && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" sx={{ color: BRAND_COLORS.primary, display: "block", mb: 1 }}>
                Image Size: {localImageSize}px
              </Typography>
              <Slider
                value={localImageSize}
                onChange={(_, value) => setLocalImageSize(value as number)}
                onChangeCommitted={(_, value) => onImageSizeChange?.(value as number)}
                min={40}
                max={150}
                step={10}
                sx={{
                  color: BRAND_COLORS.accent,
                  "& .MuiSlider-thumb": {
                    backgroundColor: BRAND_COLORS.accent,
                  },
                }}
              />
            </Box>
          )}

          <Stack direction="row" spacing={1} sx={{ justifyContent: "center", mt: 2, flexWrap: "wrap" }}>
            {showRemoveBackground && !backgroundRemoved && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleRemoveBackground}
                disabled={removingBackground}
                sx={{
                  borderColor: BRAND_COLORS.secondary,
                  color: BRAND_COLORS.secondary,
                  "&:hover": {
                    borderColor: BRAND_COLORS.accent,
                    backgroundColor: `${BRAND_COLORS.accent}20`,
                  },
                }}
              >
                Remove Background
              </Button>
            )}
            {backgroundRemoved && showDownloadButton && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownloadImage}
                disabled={removingBackground}
                sx={{
                  borderColor: BRAND_COLORS.accent,
                  color: BRAND_COLORS.accent,
                  "&:hover": {
                    borderColor: BRAND_COLORS.accent,
                    backgroundColor: `${BRAND_COLORS.accent}20`,
                  },
                }}
              >
                Download
              </Button>
            )}
            <Button
              size="small"
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              disabled={removingBackground}
              sx={{
                borderColor: BRAND_COLORS.secondary,
                color: BRAND_COLORS.secondary,
                "&:hover": {
                  borderColor: BRAND_COLORS.accent,
                  backgroundColor: `${BRAND_COLORS.accent}20`,
                },
              }}
            >
              Replace Image
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Delete />}
              onClick={handleRemoveImage}
              disabled={removingBackground}
              sx={{
                borderColor: BRAND_COLORS.secondary,
                color: BRAND_COLORS.secondary,
                "&:hover": {
                  borderColor: BRAND_COLORS.accent,
                  backgroundColor: `${BRAND_COLORS.accent}20`,
                },
              }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
