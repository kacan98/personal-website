"use client";

import { Box, Typography, Button, Stack, FormControl, InputLabel, Select, MenuItem, TextField, IconButton } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { BRAND_COLORS } from "@/app/colors";
import { SOCIAL_PLATFORMS } from "./constants";
import type { SocialLink } from "./types";
import { getSocialPlatform, generateSocialLinkId } from "./utils";

type SocialLinksEditorProps = {
  socialLinks: SocialLink[];
  onLinksChange: (links: SocialLink[]) => void;
};

export default function SocialLinksEditor({ socialLinks, onLinksChange }: SocialLinksEditorProps) {
  const handleAddSocialLink = () => {
    const usedPlatforms = socialLinks.map((link) => link.platform);
    const availablePlatform = SOCIAL_PLATFORMS.find((p) => !usedPlatforms.includes(p.name));

    if (!availablePlatform) return;

    const newLink: SocialLink = {
      id: String(generateSocialLinkId(socialLinks)),
      platform: availablePlatform.name,
      url: "",
    };

    onLinksChange([...socialLinks, newLink]);
  };

  const handleRemoveSocialLink = (id: string) => {
    onLinksChange(socialLinks.filter((link) => link.id !== id));
  };

  const handleUpdateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    onLinksChange(
      socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const getAvailablePlatforms = (currentPlatform: string) => {
    const usedPlatforms = socialLinks.map((link) => link.platform).filter((p) => p !== currentPlatform);
    return SOCIAL_PLATFORMS.filter((p) => !usedPlatforms.includes(p.name));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle1" sx={{ color: BRAND_COLORS.primary }}>
          Social Links
        </Typography>
        <Button
          size="small"
          startIcon={<Add />}
          onClick={handleAddSocialLink}
          disabled={socialLinks.length >= SOCIAL_PLATFORMS.length}
          sx={{ color: BRAND_COLORS.accent }}
        >
          Add Link
        </Button>
      </Box>

      <Stack spacing={2}>
        {socialLinks.map((link) => {
          const platform = getSocialPlatform(link.platform);
          return (
            <Box
              key={link.id}
              sx={{
                p: 2,
                border: `1px solid ${BRAND_COLORS.secondary}40`,
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", flex: 1, mr: 1 }}>
                  {platform && (
                    <img
                      src={platform.icon}
                      alt={link.platform}
                      width="24"
                      height="24"
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <FormControl sx={{ flex: 1 }}>
                    <InputLabel size="small">Platform</InputLabel>
                    <Select
                      size="small"
                      value={link.platform}
                      label="Platform"
                      onChange={(e) => handleUpdateSocialLink(link.id, "platform", e.target.value)}
                    >
                      {getAvailablePlatforms(link.platform).map((platform) => (
                        <MenuItem key={platform.name} value={platform.name}>
                          {platform.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveSocialLink(link.id)}
                  sx={{ color: BRAND_COLORS.secondary }}
                >
                  <Delete />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                size="small"
                label="URL"
                value={link.url}
                onChange={(e) => handleUpdateSocialLink(link.id, "url", e.target.value)}
                placeholder={platform?.placeholder}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
