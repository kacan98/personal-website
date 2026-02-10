import type { Metadata } from "next";

export const SITE_URL = "https://kcancara.vercel.app";
export const SITE_NAME = "Karel Čančara";
export const SITE_TITLE = "Karel Čančara - AI-Enhanced Full-Stack Developer";
export const SITE_DESCRIPTION =
  "Full-Stack Developer specializing in TypeScript, React, .NET, and AI-enhanced development. Building enterprise solutions for 100+ companies.";
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
          alt: "Karel Čančara portfolio preview",
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
    jobTitle: "Full-Stack Developer",
    sameAs: ["https://github.com/kacan98", "https://www.linkedin.com/in/kcancara"],
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };
}
