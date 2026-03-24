import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BACKGROUND_COLORS } from "./colors";
import { getBaseMetadata, getPersonSchema, getWebsiteSchema } from "@/lib/site-metadata";

export const metadata: Metadata = getBaseMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personSchema = getPersonSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: BACKGROUND_COLORS.primary,
          color: "white",
          fontFamily: "Urbanist, sans-serif",
        }}
      >
        {Object.keys(personSchema).length > 2 ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
          />
        ) : null}
        {Object.keys(websiteSchema).length > 2 ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
        ) : null}
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
