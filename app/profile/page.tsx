import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  PROFILE_CORE_SKILLS,
  PROFILE_HEADLINE,
  PROFILE_KEY_LINKS,
  PROFILE_SUMMARY,
  getProfileSchema,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/profile",
  },
};

export const dynamic = "force-static";

const profileSchema = getProfileSchema();

export default function ProfilePage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem", lineHeight: 1.6 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <h1>{SITE_NAME}</h1>
      <p>{PROFILE_HEADLINE}</p>

      <h2>Professional Summary</h2>
      <p>{PROFILE_SUMMARY}</p>

      <h2>Core Skills</h2>
      <ul>
        {PROFILE_CORE_SKILLS.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <h2>Key Links</h2>
      <ul>
        {PROFILE_KEY_LINKS.map((link) => (
          <li key={link.label}>
            {link.label}: <a href={link.href}>{link.text}</a>
          </li>
        ))}
      </ul>

      <h2>Contact</h2>
      <p>Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
    </main>
  );
}
