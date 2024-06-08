import {
  Facebook,
  GitHub,
  Instagram,
  Language,
  LibraryBooks,
  LinkedIn,
  Mail,
  OpenInNew,
  Pinterest,
  Reddit,
  School,
  Science,
  Twitter,
  WhatsApp,
  YouTube,
} from "@mui/icons-material";
import { EarthGlobeIcon } from "@sanity/icons";

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
    component: () => <OpenInNew />,
  },
  globe: {
    name: "Globe",
    component: () => <EarthGlobeIcon />,
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
  libraryBooks: {
    name: "Library Books",
    component: () => <LibraryBooks />,
  },
  twitter: {
    name: "Twitter",
    component: () => <Twitter />,
  },
  translate: {
    name: "Translate",
    component: () => <Language />,
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
  school: {
    name: "School",
    component: () => <School />,
  },
  science: {
    name: "Science",
    component: () => <Science />,
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
