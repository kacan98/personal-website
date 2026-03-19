import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { BUILD_SITE_URL, getSitemapRoutes } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = getSitemapRoutes();
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${BUILD_SITE_URL}/profile`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  for (const locale of routing.locales) {
    for (const route of routes) {
      entries.push({
        url: `${BUILD_SITE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.7,
      });
    }
  }

  return entries;
}
