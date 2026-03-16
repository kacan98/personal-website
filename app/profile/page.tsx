import type { Metadata } from "next";
import { discoveryLinks, discoveryProfile } from "@/lib/profile-discovery";

export const metadata: Metadata = {
  title: `About ${discoveryProfile.name} | ${discoveryProfile.jobTitle}`,
  description: discoveryProfile.profilePageDescription,
  alternates: {
    canonical: discoveryLinks.profile,
  },
};

export const dynamic = "force-static";

export default function ProfilePage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem", lineHeight: 1.6 }}>
      <h1>{discoveryProfile.name}</h1>
      <p>{discoveryProfile.headline}</p>

      <h2>Professional Summary</h2>
      <p>{discoveryProfile.summary}</p>

      <h2>Core Skills</h2>
      <ul>
        {discoveryProfile.coreSkills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <h2>Key Links</h2>
      <ul>
        <li>
          Portfolio: <a href={discoveryProfile.siteUrl}>{discoveryProfile.siteUrl}</a>
        </li>
        <li>
          About page: <a href={discoveryLinks.about}>{discoveryLinks.about}</a>
        </li>
        <li>
          CV: <a href={discoveryLinks.cv}>{discoveryLinks.cv}</a>
        </li>
        <li>
          LinkedIn: <a href={discoveryProfile.linkedInUrl}>{discoveryLinks.linkedInDisplay}</a>
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Email: <a href={discoveryLinks.emailMailto}>{discoveryProfile.email}</a>
      </p>
    </main>
  );
}
