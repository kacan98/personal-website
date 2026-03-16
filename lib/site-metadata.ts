import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { PROJECTS_PATH } from "@/lib/routes";
import { settings } from "@/data/settings";

export const SITE_URL = settings.siteUrl;
export const SITE_NAME = settings.siteName;
export const SITE_TITLE = `${SITE_NAME} - Full-Stack Developer`;
export const SITE_DESCRIPTION =
  "Full-Stack Developer working across TypeScript, React, Angular, .NET-based environments, and X++. Building practical software, internal tools, and workflow-heavy systems.";
export const SOCIAL_IMAGE = "/portfolio.png";

export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: SITE_URL,
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} portfolio preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      images: [SOCIAL_IMAGE],
    },
  };
}

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}${SOCIAL_IMAGE}`,
    email: "mailto:karel@cancara.dk",
    jobTitle: "Full-Stack Developer",
    sameAs: ["https://github.com/kacan98", "https://www.linkedin.com/in/kcancara"],
    knowsAbout: ["TypeScript", "React", "Next.js", ".NET", "X++", "AI-enhanced development"],
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: routing.locales,
  };
}

export function getProfileSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `About ${SITE_NAME}`,
    url: `${SITE_URL}/profile`,
    mainEntity: {
      "@type": "Person",
      name: SITE_NAME,
      jobTitle: "Full-Stack Developer",
      url: SITE_URL,
    },
  };
}

export function getSitemapRoutes(): string[] {
  return ["", "/about", PROJECTS_PATH, "/cv", "/tools", "/chatbot"];
}
