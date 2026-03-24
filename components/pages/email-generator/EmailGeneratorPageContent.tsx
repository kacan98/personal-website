"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { removeBackground } from "@imgly/background-removal";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Typography,
  Alert,
  Snackbar,
  IconButton,
  Stack,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardActionArea,
  InputAdornment,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ExpandMore, Clear, LightMode, DarkMode } from "@mui/icons-material";
import { ContentCopy, Delete, Add, Refresh } from "@mui/icons-material";
import PageWrapper from "../pageWrapper";
import { BRAND_COLORS } from "@/app/colors";
import ImageUpload from "./ImageUpload";
import { DEFAULT_SIGNATURE_DATA, SOCIAL_PLATFORMS, STORAGE_KEY, SIGNATURE_ASSET_HOST, COLOR_PRESETS as BASE_COLOR_PRESETS } from "./constants";
import { compressImageForGmail } from "./imageCompression";
import { generateSignatureHTML } from "./generateSignatureHTML";
import { getCachedPngIcon } from "./svgToPng";
import type { SignatureData, SignatureFont, SocialLink, ImageShape, ImagePosition } from "./types";

type EmailGeneratorPageContentProps = {
  title: string;
  locale: string;
};

const COLOR_PRESETS = [
  { name: "colorPresetProfessionalBlue", colors: BASE_COLOR_PRESETS[0].colors },
  { name: "colorPresetModernPurple", colors: BASE_COLOR_PRESETS[1].colors },
  { name: "colorPresetCorporateGray", colors: BASE_COLOR_PRESETS[2].colors },
  { name: "colorPresetTechGreen", colors: BASE_COLOR_PRESETS[3].colors },
  { name: "colorPresetCreativeOrange", colors: BASE_COLOR_PRESETS[4].colors },
  { name: "colorPresetElegantGray", colors: BASE_COLOR_PRESETS[5].colors },
];
export default function EmailGeneratorPageContent({ title }: EmailGeneratorPageContentProps) {
  const t = useTranslations('emailGenerator');
  const [signatureData, setSignatureData] = useState<SignatureData>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SIGNATURE_DATA;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SIGNATURE_DATA;
    }

    try {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_SIGNATURE_DATA,
        ...parsed,
        colors: {
          ...DEFAULT_SIGNATURE_DATA.colors,
          ...parsed.colors,
          iconColor: parsed.colors?.iconColor || parsed.colors?.nameColor || DEFAULT_SIGNATURE_DATA.colors.iconColor,
        },
      };
    } catch (error) {
      console.error("Failed to load signature data:", error);
      return DEFAULT_SIGNATURE_DATA;
    }
  });
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [_removingBackground, setRemovingBackground] = useState(false);
  const [_backgroundRemovalStatus, setBackgroundRemovalStatus] = useState("");
  const [_backgroundRemovalProgress, setBackgroundRemovalProgress] = useState(0);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempCrop, setTempCrop] = useState({ x: 0, y: 0 });
  const [tempZoom, setTempZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const _profileInputRef = useRef<HTMLInputElement>(null);
  const _companyLogoInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(signatureData));
    } catch (e) {
      console.error("Failed to save to localStorage (possibly too large):", e);
      // Try to save without images if too large
      try {
        const dataWithoutImages = {
          ...signatureData,
          profileImage: "",
          croppedImage: "",
          companyLogo: "",
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithoutImages));
        console.warn("Saved without images due to size limit");
      } catch (e2) {
        console.error("Failed to save even without images:", e2);
      }
    }
  }, [signatureData]);

  const generatedHTML = generateSignatureHTML(signatureData);
  const previewSignatureHtml = generatedHTML
    .replace(/<\!DOCTYPE.*?<body[^>]*>/s, "")
    .replace(/<\/body>.*$/s, "");
  const [selectionCopyHtml, setSelectionCopyHtml] = useState("");
  const [selectionCopyText, setSelectionCopyText] = useState("");

  const compressSignatureImage = useCallback(async (imageSrc: string, maxSize = 96) => {
    const trimmed = imageSrc.trim();
    if (!trimmed) return "";
    if (!/^(data:|blob:)/i.test(trimmed)) return trimmed;

    return await compressImageForGmail(trimmed, maxSize, 0.82);
  }, []);

  const updateProfileImage = useCallback(async (image: string) => {
    if (!image) {
      setSignatureData((current) => ({ ...current, profileImage: "", croppedImage: "" }));
      return;
    }

    const compressedImage = await compressSignatureImage(image, 96);
    setSignatureData((current) => ({
      ...current,
      profileImage: image,
      croppedImage: compressedImage,
      cropArea: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
    }));
  }, [compressSignatureImage]);

  const getClipboardHtml = useCallback(() => {
    if (typeof DOMParser === "undefined") {
      return generateSignatureHTML(signatureData)
        .replace(/<\!DOCTYPE.*?<body[^>]*>/s, "")
        .replace(/<\/body>.*$/s, "");
    }

    const doc = new DOMParser().parseFromString(generateSignatureHTML(signatureData), "text/html");
    const signatureTable = doc.body.querySelector("table");

    return signatureTable?.outerHTML || doc.body.innerHTML;
  }, [signatureData]);

  const getClipboardHtmlWithPreparedImages = useCallback(async () => {
    if (typeof DOMParser === "undefined") {
      return getClipboardHtml();
    }

    const doc = new DOMParser().parseFromString(getClipboardHtml(), "text/html");
    const images = Array.from(doc.querySelectorAll("img"));

    for (const image of images) {
      const src = (image.getAttribute("src") || "").trim();
      const alt = (image.getAttribute("alt") || "").trim();

      if (!src) {
        continue;
      }

      if (src.startsWith("/")) {
        image.setAttribute("src", `${SIGNATURE_ASSET_HOST}${src}`);
        continue;
      }

      if (/^data:image\/svg\+xml/i.test(src)) {
        const inlinePngSrc = await getCachedPngIcon(src, 24, 24);
        image.setAttribute("src", inlinePngSrc);
        continue;
      }

      if (/^(data:|blob:)/i.test(src)) {
        const targetSize = /company logo/i.test(alt) ? 150 : 96;
        const compressedSrc = await compressSignatureImage(src, targetSize);
        image.setAttribute("src", compressedSrc);
      }
    }

    return doc.body.innerHTML;
  }, [compressSignatureImage, getClipboardHtml]);

  useEffect(() => {
    let cancelled = false;

    void getClipboardHtmlWithPreparedImages().then((clipboardHtml) => {
      if (cancelled) {
        return;
      }

      setSelectionCopyHtml(clipboardHtml);

      if (typeof DOMParser === "undefined") {
        setSelectionCopyText(clipboardHtml.replace(/<[^>]+>/g, " " ).replace(/\s+/g, " " ).trim());
        return;
      }

      const doc = new DOMParser().parseFromString(clipboardHtml, "text/html");
      setSelectionCopyText(doc.body.textContent?.replace(/\s+/g, " " ).trim() || "");
    }).catch((error) => {
      console.error("Failed to prepare clipboard HTML for preview selection:", error);
    });

    return () => {
      cancelled = true;
    };
  }, [getClipboardHtmlWithPreparedImages]);

  const handlePreviewCopy = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    if (!selectionCopyHtml) {
      return;
    }

    event.preventDefault();
    event.clipboardData.setData("text/html", selectionCopyHtml);
    event.clipboardData.setData("text/plain", selectionCopyText || selectionCopyHtml.replace(/<[^>]+>/g, " " ).replace(/\s+/g, " " ).trim());
    setShowCopyAlert(true);
  }, [selectionCopyHtml, selectionCopyText]);

  const handleCopy = async () => {
    const clipboardHtml = selectionCopyHtml || await getClipboardHtmlWithPreparedImages();

    try {
      if (typeof ClipboardItem !== "undefined") {
        const clipboardItem = new ClipboardItem({
          "text/html": new Blob([clipboardHtml], { type: "text/html" }),
        });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        await navigator.clipboard.writeText(clipboardHtml);
      }
      setShowCopyAlert(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClearAll = () => {
    const cleared: SignatureData = {
      name: "",
      title: "",
      company: "",
      email: "",
      phone: "",
      website: "",
      profileImage: "",
      croppedImage: "",
      imageSize: 80,
      imageShape: "circle",
      imagePosition: "left",
      crop: { x: 0, y: 0 },
      zoom: 1,
      cropArea: null,
      imageFocusX: 50,
      imageFocusY: 50,
      companyLogo: "",
      font: "Arial",
      socialLinks: [],
      colors: {
        nameColor: "#666666",
        titleColor: "#999999",
        linkColor: "#0066cc",
        iconColor: "#777777",
      },
    };
    setSignatureData(cleared);
    localStorage.removeItem(STORAGE_KEY);
  };

  const _handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        void updateProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const _handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        void updateProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const _handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const _handleRemoveImage = () => {
    setSignatureData({ ...signatureData, profileImage: "" });
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleOpenCropDialog = () => {
    setTempCrop(signatureData.crop || { x: 0, y: 0 });
    setTempZoom(signatureData.zoom || 1);
    setShowCropDialog(true);
  };

  const createCroppedImage = useCallback(
    async (imageSrc: string, pixelCrop: Area, imageShape: ImageShape): Promise<string> => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve(imageSrc);
            return;
          }

          canvas.width = pixelCrop.width;
          canvas.height = pixelCrop.height;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();

          if (imageShape === "circle") {
            const radius = Math.min(canvas.width, canvas.height) / 2;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
          } else if (imageShape === "rounded") {
            const radius = 8;
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(canvas.width - radius, 0);
            ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
            ctx.lineTo(canvas.width, canvas.height - radius);
            ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
            ctx.lineTo(radius, canvas.height);
            ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            ctx.closePath();
            ctx.clip();
          }

          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
          );
          ctx.restore();

          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(imageSrc);
              return;
            }
            const reader = new FileReader();
            reader.onloadend = async () => {
              resolve(await compressSignatureImage(reader.result as string, 96));
            };
            reader.readAsDataURL(blob);
          }, "image/png");
        };
      });
    },
    []
  );

  useEffect(() => {
    if (!signatureData.profileImage || !signatureData.cropArea) {
      return;
    }

    let cancelled = false;

    void createCroppedImage(signatureData.profileImage, signatureData.cropArea, signatureData.imageShape).then((croppedImage) => {
      if (cancelled) {
        return;
      }

      setSignatureData((current) => {
        if (!current.profileImage || !current.cropArea) {
          return current;
        }

        if (current.croppedImage === croppedImage) {
          return current;
        }

        return {
          ...current,
          croppedImage,
        };
      });
    });

    return () => {
      cancelled = true;
    };
  }, [createCroppedImage, signatureData.cropArea, signatureData.imageShape, signatureData.profileImage]);

  const handleApplyCrop = async () => {
    if (croppedAreaPixels && signatureData.profileImage) {
      const croppedImage = await createCroppedImage(signatureData.profileImage, croppedAreaPixels, signatureData.imageShape);
      setSignatureData({
        ...signatureData,
        crop: tempCrop,
        zoom: tempZoom,
        cropArea: croppedAreaPixels,
        croppedImage,
      });
    } else {
      setSignatureData({
        ...signatureData,
        crop: tempCrop,
        zoom: tempZoom,
        cropArea: croppedAreaPixels,
      });
    }
    setShowCropDialog(false);
  };

  const handleCancelCrop = () => {
    setShowCropDialog(false);
    setTempCrop(signatureData.crop || { x: 0, y: 0 });
    setTempZoom(signatureData.zoom || 1);
  };

  const _handleRemoveBackground = async () => {
    if (!signatureData.profileImage) return;

    setRemovingBackground(true);
    setBackgroundRemovalProgress(0);
    setBackgroundRemovalStatus(t('preparingImage'));

    try {
      const blob = await fetch(signatureData.profileImage).then((r) => r.blob());

      setBackgroundRemovalProgress(10);
      setBackgroundRemovalStatus(t('downloadingModel'));

      // Improved simulated progress - continuously moves forward
      let simulatedProgress = 10;
      let progressSpeed = 1; // Start slow
      const progressInterval = setInterval(() => {
        if (simulatedProgress < 30) {
          progressSpeed = 1; // Slow at start
        } else if (simulatedProgress < 60) {
          progressSpeed = 0.5; // Slower in middle
        } else {
          progressSpeed = 0.3; // Very slow near end
        }

        simulatedProgress += progressSpeed;
        if (simulatedProgress <= 85) {
          setBackgroundRemovalProgress(Math.floor(simulatedProgress));
        }
      }, 500); // Update every 500ms for smoother progress

      let callbackTriggered = false;

      const result = await removeBackground(blob, {
        publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/",
        proxyToWorker: true, // Use web worker to prevent UI freeze
        progress: (key, current, total) => {
          // If real callback triggers, stop simulation
          if (!callbackTriggered) {
            callbackTriggered = true;
            clearInterval(progressInterval);
          }

          // Track download progress
          if (key === "fetch:model" || key === "fetch:wasm" || key === "fetch") {
            const percent = Math.round((current / total) * 70) + 10; // 10-80%
            setBackgroundRemovalProgress(percent);
            const mb = (current / 1024 / 1024).toFixed(1);
            const totalMb = (total / 1024 / 1024).toFixed(1);
            setBackgroundRemovalStatus(t('downloadingProgress', { current: mb, total: totalMb }));
          } else if (key === "compute:inference" || key === "compute") {
            const percent = Math.round((current / total) * 15) + 80; // 80-95%
            setBackgroundRemovalProgress(percent);
            setBackgroundRemovalStatus(t('processingImage'));
          }
        },
      });

      // Clean up interval when processing completes
      clearInterval(progressInterval);

      setBackgroundRemovalProgress(95);
      setBackgroundRemovalStatus(t('finishingUp'));

      const reader = new FileReader();
      reader.onloadend = () => {
        void updateProfileImage(reader.result as string);
        setBackgroundRemovalProgress(100);
        setBackgroundRemovalStatus(t('complete'));
        setTimeout(() => {
          setRemovingBackground(false);
          setBackgroundRemovalStatus("");
          setBackgroundRemovalProgress(0);
        }, 1000);
      };
      reader.readAsDataURL(result);
    } catch (error) {
      console.error("Failed to remove background:", error);
      alert(t('backgroundRemovalError'));
      setRemovingBackground(false);
      setBackgroundRemovalStatus("");
      setBackgroundRemovalProgress(0);
    }
  };

  const handleAddSocialLink = () => {
    // Find platforms that haven't been added yet
    const usedPlatforms = signatureData.socialLinks.map((link) => link.platform);
    const availablePlatform = SOCIAL_PLATFORMS.find((p) => !usedPlatforms.includes(p.name));

    if (!availablePlatform) return; // All platforms already added

    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: availablePlatform.name,
      url: "",
    };
    setSignatureData({
      ...signatureData,
      socialLinks: [...signatureData.socialLinks, newLink],
    });
  };

  const getAvailablePlatforms = (currentPlatform: string) => {
    const usedPlatforms = signatureData.socialLinks
      .map((link) => link.platform)
      .filter((p) => p !== currentPlatform);
    return SOCIAL_PLATFORMS.filter((p) => !usedPlatforms.includes(p.name));
  };

  const handleUpdateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    setSignatureData({
      ...signatureData,
      socialLinks: signatureData.socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    });
  };

  const handleRemoveSocialLink = (id: string) => {
    setSignatureData({
      ...signatureData,
      socialLinks: signatureData.socialLinks.filter((link) => link.id !== id),
    });
  };

  return (
    <PageWrapper title={title} containerMaxWidth="xl">
      <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3, alignItems: { lg: "flex-start" } }}>
        <Box sx={{ flex: 1, minWidth: 0, width: { xs: "100%", lg: "auto" } }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: BRAND_COLORS.dark,
              border: `1px solid ${BRAND_COLORS.secondary}40`,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mb: 2 }}>
              <Button
                size="small"
                startIcon={<Refresh />}
                onClick={handleClearAll}
                sx={{ color: BRAND_COLORS.secondary }}
              >
                {t('clearAll')}
              </Button>
            </Box>

            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ mb: 3, borderBottom: `1px solid ${BRAND_COLORS.secondary}40` }}
            >
              <Tab label={t('contentTab')} sx={{ color: BRAND_COLORS.primary }} />
              <Tab label={t('stylingTab')} sx={{ color: BRAND_COLORS.primary }} />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label={t('fullName')}
                  value={signatureData.name}
                  onChange={(e) => setSignatureData({ ...signatureData, name: e.target.value })}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: signatureData.name && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSignatureData({ ...signatureData, name: "" })}
                          edge="end"
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

            <TextField
              fullWidth
              label={t('jobTitle')}
              value={signatureData.title}
              onChange={(e) => setSignatureData({ ...signatureData, title: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: signatureData.title && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSignatureData({ ...signatureData, title: "" })}
                      edge="end"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={t('company')}
              value={signatureData.company}
              onChange={(e) => setSignatureData({ ...signatureData, company: e.target.value })}
              InputProps={{
                endAdornment: signatureData.company && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSignatureData({ ...signatureData, company: "" })}
                      edge="end"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label={t('email')}
              type="email"
              value={signatureData.email}
              onChange={(e) => setSignatureData({ ...signatureData, email: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: signatureData.email && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSignatureData({ ...signatureData, email: "" })}
                      edge="end"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label={t('phone')}
              value={signatureData.phone}
              onChange={(e) => setSignatureData({ ...signatureData, phone: e.target.value })}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: signatureData.phone && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSignatureData({ ...signatureData, phone: "" })}
                      edge="end"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

                <TextField
                  fullWidth
                  label={t('website')}
                  value={signatureData.website}
                  onChange={(e) => setSignatureData({ ...signatureData, website: e.target.value })}
                  sx={{ mb: 3 }}
                  InputProps={{
                    endAdornment: signatureData.website && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSignatureData({ ...signatureData, website: "" })}
                          edge="end"
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Divider sx={{ my: 3, borderColor: BRAND_COLORS.secondary + "40" }} />

                <ImageUpload
                  label={t('profilePicture')}
                  image={signatureData.profileImage}
                  onImageChange={(image) => { void updateProfileImage(image); }}
                  showRemoveBackground={true}
                  showCropButton={true}
                  onCropClick={handleOpenCropDialog}
                  maxWidth={`${signatureData.imageSize}px`}
                  maxHeight={`${signatureData.imageSize}px`}
                  showSizeSelector={true}
                  imageSize={signatureData.imageSize}
                  onImageSizeChange={(size) => setSignatureData({ ...signatureData, imageSize: size })}
                />

                <Divider sx={{ my: 3, borderColor: BRAND_COLORS.secondary + "40" }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: BRAND_COLORS.primary }}>
                    {t('socialLinks')}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={handleAddSocialLink}
                    disabled={signatureData.socialLinks.length >= SOCIAL_PLATFORMS.length}
                    sx={{ color: BRAND_COLORS.accent }}
                  >
                    {t('addLink')}
                  </Button>
                </Box>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  {signatureData.socialLinks.map((link) => {
                    const platform = SOCIAL_PLATFORMS.find((p) => p.name === link.platform);
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
                              <InputLabel size="small">{t('platform')}</InputLabel>
                              <Select
                                size="small"
                                value={link.platform}
                                label={t('platform')}
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
                          label={t('url')}
                          value={link.url}
                          onChange={(e) => handleUpdateSocialLink(link.id, "url", e.target.value)}
                        />
                      </Box>
                    );
                  })}
                </Stack>

                <Divider sx={{ my: 3, borderColor: BRAND_COLORS.secondary + "40" }} />

                <ImageUpload
                  label={t('companyLogo')}
                  image={signatureData.companyLogo}
                  onImageChange={(image) => setSignatureData({ ...signatureData, companyLogo: image })}
                  showRemoveBackground={true}
                  maxWidth="200px"
                  maxHeight="80px"
                />
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                {signatureData.profileImage && (
                  <>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>{t('imageShape')}</InputLabel>
                      <Select
                        value={signatureData.imageShape}
                        label={t('imageShape')}
                        onChange={(e) =>
                          setSignatureData({ ...signatureData, imageShape: e.target.value as ImageShape })
                        }
                      >
                        <MenuItem value="circle">{t('imageShapeCircle')}</MenuItem>
                        <MenuItem value="rounded">{t('imageShapeRounded')}</MenuItem>
                        <MenuItem value="square">{t('imageShapeSquare')}</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel>{t('imagePosition')}</InputLabel>
                      <Select
                        value={signatureData.imagePosition}
                        label={t('imagePosition')}
                        onChange={(e) =>
                          setSignatureData({ ...signatureData, imagePosition: e.target.value as ImagePosition })
                        }
                      >
                        <MenuItem value="left">{t('imagePositionLeft')}</MenuItem>
                        <MenuItem value="top">{t('imagePositionTop')}</MenuItem>
                      </Select>
                    </FormControl>
                  </>
                )}

                <Divider sx={{ my: 3, borderColor: BRAND_COLORS.secondary + "40" }} />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>{t('fontFamily')}</InputLabel>
                  <Select
                    value={signatureData.font}
                    label={t('fontFamily')}
                    onChange={(e) =>
                      setSignatureData({ ...signatureData, font: e.target.value as SignatureFont })
                    }
                  >
                    <MenuItem value="Arial" sx={{ fontFamily: "Arial, sans-serif" }}>Arial</MenuItem>
                    <MenuItem value="Helvetica" sx={{ fontFamily: "Helvetica, sans-serif" }}>Helvetica</MenuItem>
                    <MenuItem value="Verdana" sx={{ fontFamily: "Verdana, sans-serif" }}>Verdana</MenuItem>
                    <MenuItem value="Georgia" sx={{ fontFamily: "Georgia, serif" }}>Georgia</MenuItem>
                    <MenuItem value="Open Sans" sx={{ fontFamily: "'Open Sans', sans-serif" }}>{t('fontOpenSans')}</MenuItem>
                    <MenuItem value="Roboto" sx={{ fontFamily: "Roboto, sans-serif" }}>{t('fontRoboto')}</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant="subtitle1" sx={{ mb: 2, color: BRAND_COLORS.primary }}>
                  {t('colorSchemes')}
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
                          onClick={() =>
                            setSignatureData({ ...signatureData, colors: preset.colors })
                          }
                          sx={{ p: 2 }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, color: BRAND_COLORS.primary, fontSize: 12 }}
                          >
                            {t(preset.name)}
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
                      {t('advancedColors')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: BRAND_COLORS.primary }}>
                        {t('nameColor')}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <input
                          type="color"
                          value={signatureData.colors.nameColor}
                          onChange={(e) =>
                            setSignatureData({
                              ...signatureData,
                              colors: { ...signatureData.colors, nameColor: e.target.value },
                            })
                          }
                          style={{ width: 50, height: 40, cursor: "pointer", border: "none" }}
                        />
                        <TextField
                          size="small"
                          value={signatureData.colors.nameColor}
                          onChange={(e) =>
                            setSignatureData({
                              ...signatureData,
                              colors: { ...signatureData.colors, nameColor: e.target.value },
                            })
                          }
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: BRAND_COLORS.primary }}>
                        {t('titleColor')}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <input
                          type="color"
                          value={signatureData.colors.titleColor}
                          onChange={(e) =>
                            setSignatureData({
                              ...signatureData,
                              colors: { ...signatureData.colors, titleColor: e.target.value },
                            })
                          }
                          style={{ width: 50, height: 40, cursor: "pointer", border: "none" }}
                        />
                        <TextField
                          size="small"
                          value={signatureData.colors.titleColor}
                          onChange={(e) =>
                            setSignatureData({
                              ...signatureData,
                              colors: { ...signatureData.colors, titleColor: e.target.value },
                            })
                          }
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1, color: BRAND_COLORS.primary }}>
                        {t('linkColor')}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <input
                          type="color"
                          value={signatureData.colors.linkColor}
                          onChange={(e) =>
                            setSignatureData({
                              ...signatureData,
                              colors: { ...signatureData.colors, linkColor: e.target.value },
                            })
                          }
                          style={{ width: 50, height: 40, cursor: "pointer", border: "none" }}
                        />
                        <TextField
                          size="small"
                          value={signatureData.colors.linkColor}
                          onChange={(e) =>
                            setSignatureData({
                              ...signatureData,
                              colors: { ...signatureData.colors, linkColor: e.target.value },
                            })
                          }
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, color: BRAND_COLORS.primary }}>
                        {t('iconColor')}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <input
                          data-testid="signature-icon-color-input"
                          type="color"
                          value={signatureData.colors.iconColor}
                          onChange={(e) =>
                            setSignatureData({
                              ...signatureData,
                              colors: { ...signatureData.colors, iconColor: e.target.value },
                            })
                          }
                          style={{ width: 50, height: 40, cursor: "pointer", border: "none" }}
                        />
                        <TextField
                          data-testid="signature-icon-color-text"
                          size="small"
                          value={signatureData.colors.iconColor}
                          onChange={(e) =>
                            setSignatureData({
                              ...signatureData,
                              colors: { ...signatureData.colors, iconColor: e.target.value },
                            })
                          }
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </Paper>
        </Box>

        <Box sx={{
          flex: 1,
          minWidth: 0,
          width: { xs: "100%", lg: "auto" },
        }}>
          <Paper
            elevation={3}
            sx={{
              position: { xs: "static", lg: "sticky" },
              top: { lg: "100px" },
              p: 0,
              backgroundColor: "#f5f5f5",
              border: `1px solid ${BRAND_COLORS.secondary}40`,
              overflow: "clip",
              maxHeight: { lg: "calc(100vh - 120px)" },
              display: "flex",
              flexDirection: "column",
            }}
          >
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
                    {t('preview')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666", textAlign: "left" }}>
                    {t('previewDescription')}
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
                data-testid="signature-preview-card"
                onCopy={handlePreviewCopy}
              >
                <Typography variant="body2" sx={{ color: previewMode === 'light' ? "#666" : "#cccccc", mb: 2, textAlign: "left" }}>
                  {t('sampleEmailIntro')}
                </Typography>
                <Typography variant="body2" sx={{ color: previewMode === 'light' ? "#666" : "#cccccc", mb: 3, textAlign: "left" }}>
                  {t('sampleEmailBody')}
                </Typography>
                <Box
                  sx={{ textAlign: "left" }}
                  dangerouslySetInnerHTML={{
                    __html: previewSignatureHtml,
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", backgroundColor: "#ffffff" }}>
              <Button
                data-testid="signature-copy-button"
                variant="contained"
                fullWidth
                startIcon={<ContentCopy />}
                onClick={handleCopy}
                sx={{
                  backgroundColor: BRAND_COLORS.accent,
                  "&:hover": {
                    backgroundColor: `${BRAND_COLORS.accent}dd`,
                  },
                }}
              >
                {t('copySignature')}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={showCopyAlert}
        autoHideDuration={3000}
        onClose={() => setShowCopyAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setShowCopyAlert(false)} severity="success" sx={{ width: "100%" }}>
          {t('signatureCopied')}
        </Alert>
      </Snackbar>

      <Dialog
        open={showCropDialog}
        onClose={handleCancelCrop}
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
          {t('adjustImageTitle')}
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
            {signatureData.profileImage && (
              <Cropper
                image={signatureData.profileImage}
                crop={tempCrop}
                zoom={tempZoom}
                aspect={1}
                cropShape={signatureData.imageShape === "circle" ? "round" : "rect"}
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
              {t('zoom')}: {Math.round(tempZoom * 100)}%
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
            onClick={handleCancelCrop}
            sx={{
              color: BRAND_COLORS.secondary,
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleApplyCrop}
            variant="contained"
            sx={{
              backgroundColor: BRAND_COLORS.accent,
              "&:hover": {
                backgroundColor: `${BRAND_COLORS.accent}dd`,
              },
            }}
          >
            {t('apply')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
}
