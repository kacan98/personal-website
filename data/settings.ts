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

function normalizeSiteUrl(value: string) {
  const trimmed = value.trim().replace(/\/$/, "");
  if (!trimmed) {
    return "";
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function resolveSiteUrl(): string {
  return normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "")
  );
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

export function toAbsoluteSiteUrl(pathOrUrl: string, baseSiteUrl = settings.siteUrl) {
  if (!pathOrUrl) {
    return pathOrUrl;
  }

  if (/^(?:https?:|mailto:|tel:)/i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  if (!baseSiteUrl) {
    return pathOrUrl;
  }

  return `${baseSiteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function getMailtoHref() {
  return settings.contactEmail ? `mailto:${settings.contactEmail}` : "";
}

export function getSettings() {
  return settings;
}
