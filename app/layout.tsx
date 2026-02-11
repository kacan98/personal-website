import type { Metadata } from "next";
import { BACKGROUND_COLORS } from "./colors";
import { discoveryLinks, discoveryProfile } from "@/lib/profile-discovery";

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: discoveryProfile.name,
  url: discoveryProfile.siteUrl,
  image: discoveryLinks.image,
  sameAs: [discoveryProfile.linkedInUrl],
  email: discoveryLinks.emailMailto,
  jobTitle: discoveryProfile.jobTitle,
  knowsAbout: discoveryProfile.knowsAbout,
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${discoveryProfile.name} Portfolio`,
  url: discoveryProfile.siteUrl,
  inLanguage: discoveryProfile.languages,
};

export const metadata: Metadata = {
  title: `${discoveryProfile.name} - ${discoveryProfile.jobTitle}`,
  description: discoveryProfile.siteDescription,
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
