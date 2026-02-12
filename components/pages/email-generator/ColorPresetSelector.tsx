"use client";

import { Box, Typography, Grid, Card, CardActionArea, TextField, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { BRAND_COLORS } from "@/app/colors";
import { COLOR_PRESETS } from "./constants";
import type { SignatureData } from "./types";

type ColorPresetSelectorProps = {
  signatureData: SignatureData;
  onColorChange: (colors: SignatureData['colors']) => void;
};

export default function ColorPresetSelector({ signatureData, onColorChange }: ColorPresetSelectorProps) {
  const handleColorFieldChange = (field: keyof SignatureData['colors'], value: string) => {
    onColorChange({ ...signatureData.colors, [field]: value });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2, color: BRAND_COLORS.primary }}>
        Color Schemes
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {COLOR_PRESETS.map((preset) => (
          <Grid size={6} key={preset.name}>
            <Card
              sx={{
                border: `2px solid ${
                  JSON.stringify(signatureData.colors) === JSON.stringify(preset.colors)
                    ? BRAND_COLORS.accent
                    : `${BRAND_COLORS.secondary}40`
                }`,
                backgroundColor: BRAND_COLORS.dark,
              }}
            >
              <CardActionArea
                onClick={() => onColorChange(preset.colors)}
                sx={{ p: 2 }}
              >
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: BRAND_COLORS.primary, fontSize: 12 }}
                >
                  {preset.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: preset.colors.nameColor,
                      borderRadius: 0.5,
                      border: `1px solid ${BRAND_COLORS.secondary}40`,
                    }}
                  />
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: preset.colors.titleColor,
                      borderRadius: 0.5,
                      border: `1px solid ${BRAND_COLORS.secondary}40`,
                    }}
                  />
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: preset.colors.linkColor,
                      borderRadius: 0.5,
                      border: `1px solid ${BRAND_COLORS.secondary}40`,
                    }}
                  />
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Accordion
        sx={{
          backgroundColor: `${BRAND_COLORS.secondary}20`,
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: BRAND_COLORS.primary }} />}
        >
          <Typography variant="body2" sx={{ color: BRAND_COLORS.primary }}>
            Advanced: Custom Colors
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: BRAND_COLORS.primary }}>
              Name Color
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <input
                type="color"
                value={signatureData.colors.nameColor}
                onChange={(e) => handleColorFieldChange('nameColor', e.target.value)}
                style={{ width: 50, height: 40, cursor: "pointer", border: "none" }}
              />
              <TextField
                size="small"
                value={signatureData.colors.nameColor}
                onChange={(e) => handleColorFieldChange('nameColor', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: BRAND_COLORS.primary }}>
              Title/Company Color
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <input
                type="color"
                value={signatureData.colors.titleColor}
                onChange={(e) => handleColorFieldChange('titleColor', e.target.value)}
                style={{ width: 50, height: 40, cursor: "pointer", border: "none" }}
              />
              <TextField
                size="small"
                value={signatureData.colors.titleColor}
                onChange={(e) => handleColorFieldChange('titleColor', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: BRAND_COLORS.primary }}>
              Link Color
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <input
                type="color"
                value={signatureData.colors.linkColor}
                onChange={(e) => handleColorFieldChange('linkColor', e.target.value)}
                style={{ width: 50, height: 40, cursor: "pointer", border: "none" }}
              />
              <TextField
                size="small"
                value={signatureData.colors.linkColor}
                onChange={(e) => handleColorFieldChange('linkColor', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: BRAND_COLORS.primary }}>
              Icon Color
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <input
                type="color"
                value={signatureData.colors.iconColor}
                onChange={(e) => handleColorFieldChange('iconColor', e.target.value)}
                style={{ width: 50, height: 40, cursor: "pointer", border: "none" }}
              />
              <TextField
                size="small"
                value={signatureData.colors.iconColor}
                onChange={(e) => handleColorFieldChange('iconColor', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
