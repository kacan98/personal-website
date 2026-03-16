"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Slider, Button } from "@mui/material";
import { BRAND_COLORS } from "@/app/colors";
import type { ImageShape } from "./types";

type ImageCropDialogProps = {
  open: boolean;
  image: string;
  imageShape: ImageShape;
  initialCrop: { x: number; y: number };
  initialZoom: number;
  onClose: () => void;
  onApply: (crop: { x: number; y: number }, zoom: number, cropArea: Area) => void;
};

export default function ImageCropDialog({
  open,
  image,
  imageShape,
  initialCrop,
  initialZoom,
  onClose,
  onApply,
}: ImageCropDialogProps) {
  const [tempCrop, setTempCrop] = useState(initialCrop);
  const [tempZoom, setTempZoom] = useState(initialZoom);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApply = () => {
    if (croppedAreaPixels) {
      onApply(tempCrop, tempZoom, croppedAreaPixels);
    }
  };

  const handleCancel = () => {
    setTempCrop(initialCrop);
    setTempZoom(initialZoom);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: BRAND_COLORS.dark,
          border: `1px solid ${BRAND_COLORS.secondary}40`,
        },
      }}
    >
      <DialogTitle sx={{ color: BRAND_COLORS.primary }}>
        Adjust Image Position & Zoom
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 400,
            backgroundColor: "#000",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          {image && (
            <Cropper
              image={image}
              crop={tempCrop}
              zoom={tempZoom}
              aspect={1}
              cropShape={imageShape === "circle" ? "round" : "rect"}
              onCropChange={setTempCrop}
              onZoomChange={setTempZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: {
                  backgroundColor: "#000",
                },
              }}
            />
          )}
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="caption" sx={{ color: BRAND_COLORS.primary, display: "block", mb: 1 }}>
            Zoom: {Math.round(tempZoom * 100)}%
          </Typography>
          <Slider
            value={tempZoom}
            onChange={(_, value) => setTempZoom(value as number)}
            min={1}
            max={3}
            step={0.1}
            sx={{
              color: BRAND_COLORS.accent,
              "& .MuiSlider-thumb": {
                backgroundColor: BRAND_COLORS.accent,
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleCancel}
          sx={{
            color: BRAND_COLORS.secondary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          sx={{
            backgroundColor: BRAND_COLORS.accent,
            "&:hover": {
              backgroundColor: `${BRAND_COLORS.accent}dd`,
            },
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
