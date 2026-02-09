import type { Metadata } from "next";
import { BACKGROUND_COLORS } from "./colors";

const siteUrl = "https://kcancara.vercel.app";
const siteTitle = "Karel Čančara - Full-Stack Developer";
const siteDescription =
  "Full-Stack Developer specializing in TypeScript, React, .NET, and AI-enhanced development. Building enterprise solutions for 100+ companies.";
const socialImage = "/portfolio.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Karel Čančara portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Karel Čančara",
  url: siteUrl,
  image: `${siteUrl}${socialImage}`,
  jobTitle: "Full-Stack Developer",
  sameAs: ["https://github.com/kacan98", "https://www.linkedin.com/in/kcancara"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteTitle,
  url: siteUrl,
  description: siteDescription,
};

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
