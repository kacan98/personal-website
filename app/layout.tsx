import type { Metadata } from "next";
import { BACKGROUND_COLORS } from "./colors";
import {
  getBaseMetadata,
  getPersonSchema,
  getWebsiteSchema,
} from "@/lib/site-metadata";

export const metadata: Metadata = getBaseMetadata();

const personSchema = getPersonSchema();
const websiteSchema = getWebsiteSchema();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
