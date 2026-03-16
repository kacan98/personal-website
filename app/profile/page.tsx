import type { Metadata } from "next";
import { getProfileSchema, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/profile`,
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
      <p>
        Full-stack developer focused on building reliable product features, internal tools, and workflow-heavy
        systems with TypeScript, React, .NET, and X++.
      </p>

      <h2>Professional Summary</h2>
      <p>
        I build software across frontend and backend, from UI work and integrations to business logic and
        operational tooling. My focus is practical delivery, maintainable systems, and removing friction from
        real workflows.
      </p>

      <h2>Core Skills</h2>
      <ul>
        <li>TypeScript, JavaScript, React, Next.js</li>
        <li>.NET, C#, X++, APIs and integrations</li>
        <li>SQL, data modeling, enterprise workflows</li>
        <li>Internal tools and AI-enhanced development workflows</li>
      </ul>

      <h2>Key Links</h2>
      <ul>
        <li>Portfolio: <a href={SITE_URL}>{SITE_URL}</a></li>
        <li>Projects: <a href={`${SITE_URL}/en/projects`}>{SITE_URL}/en/projects</a></li>
        <li>CV: <a href={`${SITE_URL}/en/cv`}>{SITE_URL}/en/cv</a></li>
        <li>LinkedIn: <a href="https://www.linkedin.com/in/kcancara">linkedin.com/in/kcancara</a></li>
      </ul>

      <h2>Contact</h2>
      <p>Email: <a href="mailto:karel@cancara.dk">karel@cancara.dk</a></p>
    </main>
  );
}
