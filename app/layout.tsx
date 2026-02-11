import type { Metadata } from "next";
import { BACKGROUND_COLORS } from "./colors";

const siteUrl = "https://kcancara.vercel.app";

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Karel Čančara",
  url: siteUrl,
  image: `${siteUrl}/user.png`,
  sameAs: ["https://www.linkedin.com/in/kcancara"],
  email: "mailto:karel.cancara@gmail.com",
  jobTitle: "Full-Stack Developer",
  knowsAbout: ["TypeScript", "React", "Next.js", ".NET", "AI-assisted software development"],
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Karel Čančara Portfolio",
  url: siteUrl,
  inLanguage: ["en", "da", "sv"],
};

export const metadata: Metadata = {
  title: "Karel Čančara - Full-Stack Developer",
  description:
    "Full-Stack Developer specializing in TypeScript, React, .NET, and AI-enhanced development. Building enterprise solutions for 100+ companies.",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
