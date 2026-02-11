import type { MetadataRoute } from "next";

const siteUrl = "https://kcancara.vercel.app";
const locales = ["en", "da", "sv"] as const;
const localizedRoutes = ["", "/about", "/portfolio", "/cv", "/project-stories", "/resume", "/chatbot"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/profile`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  for (const locale of locales) {
    for (const route of localizedRoutes) {
      entries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.7,
      });
    }
  }

  return entries;
}
