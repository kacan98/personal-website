import type { Area } from "react-easy-crop";

export type SignatureFont = "Arial" | "Helvetica" | "Verdana" | "Georgia" | "Open Sans" | "Roboto";

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
};

export type ImageShape = "circle" | "square" | "rounded";
export type ImagePosition = "top" | "left";

export type SignatureData = {
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

export type ColorPreset = {
  name: string;
  colors: {
    nameColor: string;
    titleColor: string;
    linkColor: string;
    iconColor: string;
  };
};

export type SocialPlatform = {
  name: string;
  icon: string;
  placeholder: string;
};
