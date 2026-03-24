import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { PROJECTS_PATH } from "@/lib/routes";
import { settings } from "@/data/settings";

export const SITE_URL = settings.siteUrl;
export const BUILD_SITE_URL = SITE_URL;
export const SITE_NAME = settings.siteName;
export const SITE_TITLE = `${SITE_NAME} - Full-Stack Developer`;
export const SITE_DESCRIPTION =
  "Full-Stack Developer working across TypeScript, React, Angular, .NET-based environments, and X++. Building practical software, internal tools, and workflow-heavy systems.";
export const SOCIAL_IMAGE = "/portfolio.png";
export const CONTACT_EMAIL = settings.contactEmail;
export const GITHUB_URL = settings.githubUrl;
export const LINKEDIN_URL = settings.linkedinUrl;

export const PROFILE_HEADLINE =
  "Full-stack developer focused on building reliable product features, internal tools, and workflow-heavy systems with TypeScript, React, .NET, and X++.";

export const PROFILE_SUMMARY =
  "I build software across frontend and backend, from UI work and integrations to business logic and operational tooling. My focus is practical delivery, maintainable systems, and removing friction from real workflows.";

export const PROFILE_CORE_SKILLS = [
  "TypeScript, JavaScript, React, Next.js",
  ".NET, C#, X++, APIs and integrations",
  "SQL, data modeling, enterprise workflows",
  "Internal tools and AI-enhanced development workflows",
] as const;

export const PROFILE_KEY_LINKS = [
  { label: "Portfolio", href: SITE_URL || "/", text: SITE_URL || "/" },
  { label: "Projects", href: SITE_URL ? `${SITE_URL}/en${PROJECTS_PATH}` : `/en${PROJECTS_PATH}`, text: SITE_URL ? `${SITE_URL}/en${PROJECTS_PATH}` : `/en${PROJECTS_PATH}` },
  { label: "CV", href: SITE_URL ? `${SITE_URL}/en/cv` : "/en/cv", text: SITE_URL ? `${SITE_URL}/en/cv` : "/en/cv" },
  ...(LINKEDIN_URL ? [{ label: "LinkedIn", href: LINKEDIN_URL, text: LINKEDIN_URL.replace(/^https?:\/\/(www\.)?/, "") }] : []),
] as const;

export function getBaseMetadata(): Metadata {
  return {
    ...(BUILD_SITE_URL ? { metadataBase: new URL(BUILD_SITE_URL) } : {}),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      ...(BUILD_SITE_URL ? { url: BUILD_SITE_URL } : {}),
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
    ...(BUILD_SITE_URL ? { url: BUILD_SITE_URL } : {}),
    ...(BUILD_SITE_URL ? { image: `${BUILD_SITE_URL}${SOCIAL_IMAGE}` } : {}),
    email: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : undefined,
    jobTitle: "Full-Stack Developer",
    sameAs: [GITHUB_URL, LINKEDIN_URL].filter(Boolean),
    knowsAbout: ["TypeScript", "React", "Next.js", ".NET", "X++", "AI-enhanced development"],
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    ...(BUILD_SITE_URL ? { url: BUILD_SITE_URL } : {}),
    description: SITE_DESCRIPTION,
    inLanguage: routing.locales,
  };
}

export function getProfileSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `About ${SITE_NAME}`,
    ...(BUILD_SITE_URL ? { url: `${BUILD_SITE_URL}/profile` } : {}),
    mainEntity: {
      "@type": "Person",
      name: SITE_NAME,
      jobTitle: "Full-Stack Developer",
      ...(BUILD_SITE_URL ? { url: BUILD_SITE_URL } : {}),
    },
  };
}

export function getSitemapRoutes(): string[] {
  const routes = ["", "/about", PROJECTS_PATH, "/cv", "/tools"];

  if (settings.specialPages?.chatbot) {
    routes.push("/chatbot");
  }

  return routes;
}

export function getLlmsKeyPages(): string[] {
  return ["", "/about", PROJECTS_PATH, "/cv"];
}
