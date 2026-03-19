import type { MetadataRoute } from "next";
import { BUILD_SITE_URL, SITE_URL } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${BUILD_SITE_URL}/sitemap.xml`,
    host: SITE_URL || BUILD_SITE_URL,
  };
}
