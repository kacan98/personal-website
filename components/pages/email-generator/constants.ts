import { settings } from "@/data/settings";
import type { SignatureData, ColorPreset, SocialPlatform } from "./types";

export const STORAGE_KEY = "email-signature-data";
const SIGNATURE_ASSET_HOST = (settings.siteUrl || "https://www.cancara.dk").replace(/\/$/, "");

const hostedAssetUrl = (path: string) => `${SIGNATURE_ASSET_HOST}${path.startsWith("/") ? path : `/${path}`}`;

export const SIGNATURE_HOSTED_ASSETS = {
  profileImage: hostedAssetUrl("/images/email-signature/profile-96.jpg"),
  icons: {
    LinkedIn: hostedAssetUrl("/images/email-signature-icons/linkedin.png"),
    GitHub: hostedAssetUrl("/images/email-signature-icons/github.png"),
    Twitter: hostedAssetUrl("/images/email-signature-icons/twitter.png"),
    Instagram: hostedAssetUrl("/images/email-signature-icons/instagram.png"),
    Facebook: hostedAssetUrl("/images/email-signature-icons/facebook.png"),
    YouTube: hostedAssetUrl("/images/email-signature-icons/youtube.png"),
    Medium: hostedAssetUrl("/images/email-signature-icons/medium.png"),
    Website: hostedAssetUrl("/images/email-signature-icons/website.png"),
  },
} as const;

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

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: "LinkedIn",
    icon: SIGNATURE_HOSTED_ASSETS.icons.LinkedIn,
    placeholder: "https://linkedin.com/in/yourprofile",
  },
  {
    name: "GitHub",
    icon: SIGNATURE_HOSTED_ASSETS.icons.GitHub,
    placeholder: "https://github.com/yourusername",
  },
  {
    name: "Twitter",
    icon: SIGNATURE_HOSTED_ASSETS.icons.Twitter,
    placeholder: "https://twitter.com/yourusername",
  },
  {
    name: "Instagram",
    icon: SIGNATURE_HOSTED_ASSETS.icons.Instagram,
    placeholder: "https://instagram.com/yourusername",
  },
  {
    name: "Facebook",
    icon: SIGNATURE_HOSTED_ASSETS.icons.Facebook,
    placeholder: "https://facebook.com/yourprofile",
  },
  {
    name: "YouTube",
    icon: SIGNATURE_HOSTED_ASSETS.icons.YouTube,
    placeholder: "https://youtube.com/@yourchannel",
  },
  {
    name: "Medium",
    icon: SIGNATURE_HOSTED_ASSETS.icons.Medium,
    placeholder: "https://medium.com/@yourusername",
  },
  {
    name: "Website",
    icon: SIGNATURE_HOSTED_ASSETS.icons.Website,
    placeholder: "https://yourwebsite.com",
  },
];

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
    nameColor: "#666666",
    titleColor: "#999999",
    linkColor: "#0066cc",
    iconColor: "#777777",
  },
};
