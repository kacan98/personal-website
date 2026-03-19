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
import { settings } from "@/data/settings";
import ImageUpload from "./ImageUpload";

type SignatureFont = "Arial" | "Helvetica" | "Verdana" | "Georgia" | "Open Sans" | "Roboto";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
};

type ImageShape = "circle" | "square" | "rounded";
type ImagePosition = "top" | "left";

type SignatureData = {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  profileImage: string;
  croppedImage: string; // The final cropped image to use
  imageSize: number;
  imageShape: ImageShape;
  imagePosition: ImagePosition;
  imageFocusX: number; // Horizontal focus point (0-100)
  imageFocusY: number; // Vertical focus point (0-100)
  crop: { x: number; y: number }; // Crop position
  zoom: number; // Zoom level
  cropArea: Area | null; // Cropped area pixels
  companyLogo: string;
  font: SignatureFont;
  socialLinks: SocialLink[];
  colors: {
    nameColor: string;
    titleColor: string;
    linkColor: string;
    iconColor: string;
  };
};

type EmailGeneratorPageContentProps = {
  title: string;
  locale: string;
};

const STORAGE_KEY = "email-signature-data";
const SIGNATURE_ICON_BASE_URL = `${settings.siteUrl}/images/email-signature-icons`;

const COLOR_PRESETS = [
  {
    name: "colorPresetProfessionalBlue",
    colors: { nameColor: "#666666", titleColor: "#999999", linkColor: "#0066cc", iconColor: "#777777" },
  },
  {
    name: "colorPresetModernPurple",
    colors: { nameColor: "#7a6090", titleColor: "#999999", linkColor: "#9b6cf6", iconColor: "#7a6090" },
  },
  {
    name: "colorPresetCorporateGray",
    colors: { nameColor: "#666666", titleColor: "#888888", linkColor: "#4a5568", iconColor: "#777777" },
  },
  {
    name: "colorPresetTechGreen",
    colors: { nameColor: "#2a8a6b", titleColor: "#999999", linkColor: "#15a679", iconColor: "#2a8a6b" },
  },
  {
    name: "colorPresetCreativeOrange",
    colors: { nameColor: "#bc6d52", titleColor: "#999999", linkColor: "#fa681c", iconColor: "#bc6d52" },
  },
  {
    name: "colorPresetElegantGray",
    colors: { nameColor: "#7a8598", titleColor: "#999999", linkColor: "#7b8593", iconColor: "#8a9098" },
  },
];

const SOCIAL_PLATFORMS = [
  {
    name: "LinkedIn",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230077b5'%3E%3Cpath d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/%3E%3C/svg%3E"
  },
  {
    name: "GitHub",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23181717'%3E%3Cpath d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/%3E%3C/svg%3E"
  },
  {
    name: "Twitter",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231DA1F2'%3E%3Cpath d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'/%3E%3C/svg%3E"
  },
  {
    name: "Instagram",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='url(%23instaGradient)'%3E%3Cdefs%3E%3ClinearGradient id='instaGradient' x1='0%25' y1='100%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23f09433;stop-opacity:1'/%3E%3Cstop offset='25%25' style='stop-color:%23e6683c;stop-opacity:1'/%3E%3Cstop offset='50%25' style='stop-color:%23dc2743;stop-opacity:1'/%3E%3Cstop offset='75%25' style='stop-color:%23cc2366;stop-opacity:1'/%3E%3Cstop offset='100%25' style='stop-color:%23bc1888;stop-opacity:1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/%3E%3C/svg%3E"
  },
  {
    name: "Facebook",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231877F2'%3E%3Cpath d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/%3E%3C/svg%3E"
  },
  {
    name: "YouTube",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF0000'%3E%3Cpath d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'/%3E%3C/svg%3E"
  },
  {
    name: "Medium",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z'/%3E%3C/svg%3E"
  },
  {
    name: "Website",
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666666'%3E%3Cpath d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z'/%3E%3C/svg%3E"
  },
];

const DEFAULT_SIGNATURE_DATA: SignatureData = {
  name: "Karel Čančara",
  title: "Full Stack Developer",
  company: "Dynaway",
  email: "karel.cancara@gmail.com",
  phone: "",
  website: "https://kcancara.vercel.app",
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
  socialLinks: [
    { id: "1", platform: "LinkedIn", url: "https://www.linkedin.com/in/kcancara" },
    { id: "2", platform: "GitHub", url: "https://github.com/kacan98" },
  ],
  colors: {
    nameColor: "#666666",
    titleColor: "#999999",
    linkColor: "#0066cc",
    iconColor: "#777777",
  },
};

const getFontStack = (font: SignatureFont): string => {
  const fontStacks: Record<SignatureFont, string> = {
    Arial: "Arial, Helvetica, sans-serif",
    Helvetica: "Helvetica, Arial, sans-serif",
    Verdana: "Verdana, Geneva, sans-serif",
    Georgia: "Georgia, 'Times New Roman', serif",
    "Open Sans": "'Open Sans', Arial, sans-serif",
    Roboto: "Roboto, Arial, sans-serif",
  };
  return fontStacks[font];
};

const getFontImport = (font: SignatureFont): string => {
  const googleFonts: Record<SignatureFont, string> = {
    Arial: "",
    Helvetica: "",
    Verdana: "",
    Georgia: "",
    "Open Sans":
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap",
    Roboto: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  };
  return googleFonts[font];
};

const getBorderRadius = (shape: ImageShape): string => {
  switch (shape) {
    case "circle":
      return "50%";
    case "rounded":
      return "8px";
    case "square":
      return "0";
    default:
      return "50%";
  }
};

const generateSignatureHTML = (data: SignatureData): string => {
  const { name, title, company, email, phone, website, profileImage, croppedImage, imageSize, imageShape, imagePosition, companyLogo, font, socialLinks, colors } = data;
  const fontFamily = getFontStack(font);
  const fontImport = getFontImport(font);
  const lineHeight = "1.4";

  // Helper function to create colored icon SVG
  const createColoredIcon = (platform: typeof SOCIAL_PLATFORMS[0], color: string) => {
    // Decode the data URI to get the actual SVG
    const svgContent = decodeURIComponent(platform.icon.replace('data:image/svg+xml,', ''));

    // Replace the fill color (matches fill='#hexcolor' or fill='%23hexcolor')
    const coloredSvg = svgContent.replace(/fill='[^']*'/g, `fill='${color}'`);

    // Re-encode for data URI
    return `data:image/svg+xml,${encodeURIComponent(coloredSvg)}`;
  };

  const socialIconsHtml = socialLinks
    .map((link) => {
      const platform = SOCIAL_PLATFORMS.find((p) => p.name === link.platform);
      if (!platform || !link.url) return "";
      const iconSrc = createColoredIcon(platform, colors.iconColor);
      return `<a href="${link.url}" style="display: inline-block; margin-right: 8px;" target="_blank">
        <img src="${iconSrc}" alt="${link.platform}" width="24" height="24" style="width: 24px; height: 24px; display: block; border: none;">
      </a>`;
    })
    .join("");

  // Use croppedImage if available, otherwise fall back to profileImage
  const imageToUse = croppedImage || profileImage;
  const profileImageHtml = imageToUse
    ? `<td style="padding-right: 15px; vertical-align: ${imagePosition === "top" ? "top" : "middle"};">
        <img src="${imageToUse}" alt="${name}" width="${imageSize}" height="${imageSize}" style="width: ${imageSize}px; height: ${imageSize}px; border-radius: ${getBorderRadius(imageShape)}; display: block; object-fit: cover; border: none;">
      </td>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  ${fontImport ? `<link href="${fontImport}" rel="stylesheet">` : ""}
</head>
<body style="margin: 0; padding: 0; font-family: ${fontFamily};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; font-family: ${fontFamily};">
    <tr>
      ${profileImageHtml}
      <td style="vertical-align: ${imagePosition === "top" ? "top" : "middle"}; padding: 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
          <tr>
            <td style="padding: 0 0 4px 0;">
              <span style="font-size: 16px; font-weight: 700; color: ${colors.nameColor}; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">${name}</span>
            </td>
          </tr>
          ${title ? `<tr>
            <td style="padding: 0 0 2px 0;">
              <span style="font-size: 14px; color: ${colors.titleColor}; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">${title}</span>
            </td>
          </tr>` : ""}
          ${company ? `<tr>
            <td style="padding: 0 0 10px 0;">
              <span style="font-size: 14px; color: ${colors.titleColor}; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">${company}</span>
            </td>
          </tr>` : ""}
          ${email ? `<tr>
            <td style="padding: 0 0 3px 0;">
              <span style="font-size: 13px; color: #333333; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">
                <a href="mailto:${email}" style="color: ${colors.linkColor}; text-decoration: none;">${email}</a>
              </span>
            </td>
          </tr>` : ""}
          ${phone ? `<tr>
            <td style="padding: 0 0 3px 0;">
              <span style="font-size: 13px; color: #333333; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">
                <a href="tel:${phone.replace(/\s/g, "")}" style="color: ${colors.linkColor}; text-decoration: none;">${phone}</a>
              </span>
            </td>
          </tr>` : ""}
          ${website ? `<tr>
            <td style="padding: 0 0 10px 0;">
              <span style="font-size: 13px; color: #333333; font-family: ${fontFamily}; display: block; margin: 0; line-height: ${lineHeight};">
                <a href="${website}" style="color: ${colors.linkColor}; text-decoration: none;" target="_blank">${website.replace(/^https?:\/\//, "")}</a>
              </span>
            </td>
          </tr>` : ""}
          ${
            socialIconsHtml
              ? `<tr>
            <td style="padding: 0;">
              ${socialIconsHtml}
            </td>
          </tr>`
              : ""
          }
          ${
            companyLogo
              ? `<tr>
            <td style="padding: 10px 0 0 0;">
              <img src="${companyLogo}" alt="Company Logo" style="max-width: 150px; height: auto; display: block; border: none;">
            </td>
          </tr>`
              : ""
          }
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

};

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

  const getClipboardHtml = () => {
    const html = generateSignatureHTML(signatureData)
      .replace(/<\!DOCTYPE.*?<body[^>]*>/s, "")
      .replace(/<\/body>.*$/s, "");

    if (typeof DOMParser === "undefined") {
      return html;
    }

    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");

    doc.querySelectorAll("a img[alt]").forEach((img) => {
      const platform = img.getAttribute("alt") || "Link";
      const slug = platform.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      img.setAttribute("src", `${SIGNATURE_ICON_BASE_URL}/${slug}.png`);
      img.setAttribute("width", "24");
      img.setAttribute("height", "24");
    });

    doc.querySelectorAll("a").forEach((anchor) => {
      anchor.setAttribute("target", "_blank");
    });

    return doc.body.innerHTML;
  };

  const handleCopy = async () => {
    const clipboardHtml = getClipboardHtml();
    const plainTextSignature = [
      signatureData.name,
      signatureData.title,
      signatureData.company,
      signatureData.email,
      signatureData.phone,
      signatureData.website,
      ...signatureData.socialLinks.filter((link) => link.url).map((link) => `${link.platform}: ${link.url}`),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      if (typeof ClipboardItem !== "undefined") {
        const clipboardItem = new ClipboardItem({
          "text/html": new Blob([clipboardHtml], { type: "text/html" }),
          "text/plain": new Blob([plainTextSignature], { type: "text/plain" }),
        });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        await navigator.clipboard.writeText(plainTextSignature);
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
        setSignatureData({ ...signatureData, profileImage: reader.result as string });
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
        setSignatureData({ ...signatureData, profileImage: reader.result as string });
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
    async (imageSrc: string, pixelCrop: Area): Promise<string> => {
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

          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(imageSrc);
              return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(blob);
          }, "image/png");
        };
      });
    },
    []
  );

  const handleApplyCrop = async () => {
    if (croppedAreaPixels && signatureData.profileImage) {
      const croppedImage = await createCroppedImage(signatureData.profileImage, croppedAreaPixels);
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
        setSignatureData({ ...signatureData, profileImage: reader.result as string });
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
                  onImageChange={(image) => setSignatureData({ ...signatureData, profileImage: image, croppedImage: "" })}
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
                    __html: generateSignatureHTML(signatureData).replace(
                      /<\!DOCTYPE.*?<body[^>]*>/s,
                      ""
                    ).replace(/<\/body>.*$/s, ""),
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", backgroundColor: "#ffffff" }}>
              <Button
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
