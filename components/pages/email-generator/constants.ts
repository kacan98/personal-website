import { settings } from "@/data/settings";
import type { SignatureData, ColorPreset, SocialPlatform } from "./types";
import {
  createSocialIconDataUrl,
  SOCIAL_ICON_PLATFORM_NAMES,
  SOCIAL_ICON_SLUGS,
  type SocialIconPlatformName,
} from "./iconSources";

export const STORAGE_KEY = "email-signature-data";
export const SIGNATURE_ASSET_HOST = settings.siteUrl.replace(/\/$/, "");

export const hostedAssetUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return SIGNATURE_ASSET_HOST ? `${SIGNATURE_ASSET_HOST}${normalizedPath}` : normalizedPath;
};

export const presetSlug = (presetName: string) => presetName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: "Professional Blue",
    colors: { nameColor: "#666666", titleColor: "#999999", linkColor: "#0066cc", iconColor: "#777777" },
  },
  {
    name: "Modern Purple",
    colors: { nameColor: "#7a6090", titleColor: "#999999", linkColor: "#9b6cf6", iconColor: "#7a6090" },
  },
  {
    name: "Corporate Gray",
    colors: { nameColor: "#666666", titleColor: "#888888", linkColor: "#4a5568", iconColor: "#777777" },
  },
  {
    name: "Tech Green",
    colors: { nameColor: "#2a8a6b", titleColor: "#999999", linkColor: "#15a679", iconColor: "#2a8a6b" },
  },
  {
    name: "Creative Orange",
    colors: { nameColor: "#bc6d52", titleColor: "#999999", linkColor: "#fa681c", iconColor: "#bc6d52" },
  },
  {
    name: "Elegant Gray",
    colors: { nameColor: "#7a8598", titleColor: "#999999", linkColor: "#7b8593", iconColor: "#8a9098" },
  },
];

export const colorsMatchPreset = (colors: SignatureData["colors"], preset: ColorPreset) => (
  colors.nameColor === preset.colors.nameColor
  && colors.titleColor === preset.colors.titleColor
  && colors.linkColor === preset.colors.linkColor
  && colors.iconColor === preset.colors.iconColor
);

export const getMatchingColorPreset = (colors: SignatureData["colors"]) => (
  COLOR_PRESETS.find((preset) => colorsMatchPreset(colors, preset)) || null
);

export const getPresetHostedIconUrl = (presetName: string, platformName: SocialIconPlatformName) => (
  hostedAssetUrl(`/images/email-signature-icons/presets/${presetSlug(presetName)}/${SOCIAL_ICON_SLUGS[platformName]}.png`)
);

export const SIGNATURE_HOSTED_ASSETS = {
  profileImage: hostedAssetUrl("/images/email-signature/profile-96.jpg"),
} as const;

const SOCIAL_PLATFORM_PLACEHOLDERS: Record<SocialIconPlatformName, string> = {
  LinkedIn: "https://linkedin.com/in/yourprofile",
  GitHub: "https://github.com/yourusername",
  Twitter: "https://twitter.com/yourusername",
  Instagram: "https://instagram.com/yourusername",
  Facebook: "https://facebook.com/yourprofile",
  YouTube: "https://youtube.com/@yourchannel",
  Medium: "https://medium.com/@yourusername",
  Website: "https://yourwebsite.com",
};

const defaultPreset = COLOR_PRESETS[0];

export const SOCIAL_PLATFORMS: SocialPlatform[] = SOCIAL_ICON_PLATFORM_NAMES.map((name) => ({
  name,
  icon: createSocialIconDataUrl(name, defaultPreset.colors.iconColor),
  placeholder: SOCIAL_PLATFORM_PLACEHOLDERS[name],
}));

export const DEFAULT_SIGNATURE_DATA: SignatureData = {
  name: "Karel Čančara",
  title: "Full Stack Developer",
  company: "Dynaway",
  email: settings.contactEmail,
  phone: "",
  website: settings.siteUrl,
  profileImage: SIGNATURE_HOSTED_ASSETS.profileImage,
  croppedImage: "",
  imageSize: 64,
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
    ...(settings.linkedinUrl ? [{ id: "1", platform: "LinkedIn", url: settings.linkedinUrl }] : []),
    ...(settings.githubUrl ? [{ id: settings.linkedinUrl ? "2" : "1", platform: "GitHub", url: settings.githubUrl }] : []),
  ],
  colors: {
    nameColor: defaultPreset.colors.nameColor,
    titleColor: defaultPreset.colors.titleColor,
    linkColor: defaultPreset.colors.linkColor,
    iconColor: defaultPreset.colors.iconColor,
  },
};
