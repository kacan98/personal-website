import {
  Facebook,
  GitHub,
  Instagram,
  LinkedIn,
  LinkOff,
  Mail,
  Pinterest,
  Reddit,
  Twitter,
  WhatsApp,
  YouTube,
} from "@mui/icons-material";

export const SUPPORTED_ICONS: {
  [key: string]: {
    name: string;
    component: () => JSX.Element;
  };
} = {
  gitHub: {
    name: "GitHub",
    component: () => <GitHub />,
  },
  externalLink: {
    name: "External link",
    component: () => <LinkOff />,
  },
  mail: {
    name: "Mail",
    component: () => <Mail />,
  },
  instagram: {
    name: "Instagram",
    component: () => <Instagram />,
  },
  facebook: {
    name: "Facebook",
    component: () => <Facebook />,
  },
  linkedIn: {
    name: "LinkedIn",
    component: () => <LinkedIn />,
  },
  twitter: {
    name: "Twitter",
    component: () => <Twitter />,
  },
  youTube: {
    name: "YouTube",
    component: () => <YouTube />,
  },
  pinterest: {
    name: "Pinterest",
    component: () => <Pinterest />,
  },
  reddit: {
    name: "Reddit",
    component: () => <Reddit />,
  },
  whatsApp: {
    name: "WhatsApp",
    component: () => <WhatsApp />,
  },
};

export const supportedIconNames: {
  name: string;
  key: string;
}[] = Object.entries(SUPPORTED_ICONS).map(([key, { name }]) => ({ name, key }));
