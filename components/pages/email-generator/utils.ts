import type { SignatureFont, ImageShape, SocialLink } from "./types";
import { SOCIAL_PLATFORMS } from "./constants";
import { createSocialIconDataUrl } from "./iconSources";
import type { SocialIconPlatformName } from "./iconSources";

export const getFontStack = (font: SignatureFont): string => {
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

export const getFontImport = (font: SignatureFont): string => {
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

export const getBorderRadius = (shape: ImageShape): string => {
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

export const createColoredIcon = (platform: typeof SOCIAL_PLATFORMS[0] | string, color: string) => {
  const platformName = typeof platform === "string" ? platform : platform.name;
  return createSocialIconDataUrl(platformName as SocialIconPlatformName, color);
};

export const getSocialPlatform = (platformName: string) => {
  return SOCIAL_PLATFORMS.find((p) => p.name === platformName);
};

export const generateSocialLinkId = (socialLinks: SocialLink[]) => {
  return Math.max(0, ...socialLinks.map((link) => parseInt(link.id) || 0)) + 1;
};
