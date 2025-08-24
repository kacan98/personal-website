// Simple data utilities

import { CVSettings, Settings, StylesSettings, Gallery } from './types';
import { cvConfigEn } from './components/pages/cv/data/cv-en';
import { cvConfigDa } from './components/pages/cv/data/cv-da';

const settingsData: Settings = {
  mainPage: {
    mainImage: "/images/settings/main-background.jpg",
    subtitles: [
      "Web Developer",
      "Angular Developer", 
      "Scrum Master",
      "React Developer",
      "Frontend Developer"
    ],
    title: "Karel Čančara"
  },
  metadata: {
    description: "Portfolio of a Frontend Developer",
    title: "Karel Čančara"
  },
  social: [
    {
      title: "GitHub",
      url: "https://github.com/kacan98",
      iconName: "gitHub"
    },
    {
      title: "LinkedIn", 
      url: "https://www.linkedin.com/in/kcancara",
      iconName: "linkedIn"
    }
  ],
  specialPages: {
    chatbot: true
  }
};

const galleriesData: Gallery[] = [
  {
    title: "Portfolio",
    filteringIsEnabled: true
  }
];

export async function getCvSettings(locale: string = 'en'): Promise<CVSettings> {
  switch (locale) {
    case 'da':
      return cvConfigDa;
    case 'en':
    default:
      return cvConfigEn;
  }
}

export async function getSettings(): Promise<Settings | undefined> {
  return settingsData;
}

export async function getStyles(): Promise<StylesSettings | undefined> {
  return { font: "Urbanist" };
}

export async function getGalleries(): Promise<Gallery[]> {
  return galleriesData;
}

export async function getSocials() {
  return settingsData?.social || [];
}

export async function getCVPicture(locale: string = 'en'): Promise<string | null> {
  const config = await getCvSettings(locale);
  return config.profilePicture || null;
}