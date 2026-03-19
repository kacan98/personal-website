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

function resolveSiteUrl(): string {
  const explicitSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (explicitSiteUrl) {
    return explicitSiteUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }

  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";
}

export const settings: AppSettings = {
  siteName: "Karel Čančara",
  siteDescription: "Full Stack Developer | TypeScript, Angular, React, .NET",
  siteUrl: resolveSiteUrl(),
  authorName: "Karel Čančara",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || "",
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
