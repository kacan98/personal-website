// App settings data
export interface AppSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  authorName: string;
  specialPages?: any;
}

export const settings: AppSettings = {
  siteName: "Karel Čančara",
  siteDescription: "Full Stack Developer | TypeScript, Angular, React, .NET",
  siteUrl: "https://kcancara.vercel.app",
  authorName: "Karel Čančara",
  specialPages: {
    chatbot: true
  }
};

export function getSettings() {
  return settings;
}