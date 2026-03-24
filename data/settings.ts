// App settings data
export interface AppSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  authorName: string;
  contactEmail: string;
  linkedinUrl: string;
  githubUrl: string;
  specialPages?: Record<string, boolean>;
}

const DEFAULT_PUBLIC_IDENTITY = {
  contactEmail: "karel@cancara.dk",
  linkedinUrl: "https://www.linkedin.com/in/kcancara",
  githubUrl: "https://github.com/kacan98",
} as const;

function resolveSiteUrl(): string {
  const explicitSiteUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    (process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : "") ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    "";

  const normalizeSiteUrl = (value: string) => {
    const trimmed = value.trim().replace(/\/$/, "");
    if (!trimmed) {
      return "";
    }

    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  if (explicitSiteUrl) {
    return normalizeSiteUrl(explicitSiteUrl);
  }

  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
}

export const settings: AppSettings = {
  siteName: "Karel Čančara",
  siteDescription: "Full Stack Developer | TypeScript, Angular, React, .NET",
  siteUrl: resolveSiteUrl(),
  authorName: "Karel Čančara",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || DEFAULT_PUBLIC_IDENTITY.contactEmail,
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || DEFAULT_PUBLIC_IDENTITY.linkedinUrl,
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || DEFAULT_PUBLIC_IDENTITY.githubUrl,
  specialPages: {
    chatbot: true
  }
};

export function getSiteHost() {
  return settings.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function getMailtoHref() {
  return settings.contactEmail ? `mailto:${settings.contactEmail}` : "";
}

export function getSettings() {
  return settings;
}
