import type { Metadata } from "next";

const siteUrl = "https://kcancara.vercel.app";

export const metadata: Metadata = {
  title: "About Karel Čančara | Full-Stack Developer",
  description:
    "Static, machine-readable profile for Karel Čančara: full-stack developer focused on TypeScript, React, .NET, and AI-enhanced product development.",
  alternates: {
    canonical: `${siteUrl}/profile`,
  },
};

export const dynamic = "force-static";

export default function ProfilePage() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem", lineHeight: 1.6 }}>
      <h1>Karel Čančara</h1>
      <p>
        Full-stack developer focused on building reliable product features with TypeScript,
        React, .NET, and practical AI-assisted workflows.
      </p>

      <h2>Professional Summary</h2>
      <p>
        I build web products end-to-end, from API and data-layer work to polished frontend
        interfaces. I prioritize clear architecture, maintainable code, and measurable product
        outcomes.
      </p>

      <h2>Core Skills</h2>
      <ul>
        <li>TypeScript, JavaScript, React, Next.js</li>
        <li>.NET / C# backend services and APIs</li>
        <li>SQL and data modeling</li>
        <li>AI-enhanced engineering workflows</li>
      </ul>

      <h2>Key Links</h2>
      <ul>
        <li>
          Portfolio: <a href={siteUrl}>{siteUrl}</a>
        </li>
        <li>
          About page: <a href={`${siteUrl}/en/about`}>{siteUrl}/en/about</a>
        </li>
        <li>
          CV: <a href={`${siteUrl}/en/cv`}>{siteUrl}/en/cv</a>
        </li>
        <li>
          LinkedIn: <a href="https://www.linkedin.com/in/kcancara">linkedin.com/in/kcancara</a>
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Email: <a href="mailto:karel.cancara@gmail.com">karel.cancara@gmail.com</a>
      </p>
    </main>
  );
}
