// Simple type definitions for our local data

export type CVSettings = {
  on: boolean;
  name: string;
  subtitle: string;
  mainColumn: CvSection[];
  sideColumn: CvSection[];
  profilePicture?: string;
};

export interface CvSubSection {
  id?: string;
  title?: string;
  subtitles?: {
    left?: string;
    right?: string;
  };
  paragraphs?: Paragraph[];
  bulletPoints?: BulletPoint[];
}

export interface CvSection extends CvSubSection {
  subSections?: CvSubSection[];
  bulletPoints?: BulletPoint[];
}

export type BulletPoint = {
  id?: string;
  iconName: string;
  text: string;
  url?: string;
};

export type Paragraph = {
  id?: string;
  text: string;
};

export type Settings = {
  mainPage?: {
    title?: string;
    subtitles?: string[];
    mainImage?: string;
    metadataDescription?: string;
  };
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  social?: Link[];
  specialPages?: {
    chatbot: boolean;
  };
};

export type StylesSettings = {
  theme?: string;
  font?: string;
};

export type Project = {
  title: string;
  slug: string;
  image: string;
  tags: string[];
  links: Link[];
  featured: boolean;
  description?: string;
  order?: number;
};

export type Gallery = {
  title: string;
  filteringIsEnabled?: boolean;
};

export type Link = {
  title: string;
  url: string;
  iconName: string;
};