export const discoveryProfile = {
  siteUrl: "https://kcancara.vercel.app",
  name: "Karel Čančara",
  headline:
    "Full-stack developer focused on TypeScript, React, .NET, and AI-enhanced product development.",
  profilePageDescription:
    "Static, machine-readable profile for Karel Čančara: full-stack developer focused on TypeScript, React, .NET, and AI-enhanced product development.",
  siteDescription:
    "Full-Stack Developer specializing in TypeScript, React, .NET, and AI-enhanced development. Building enterprise solutions for 100+ companies.",
  summary:
    "I build web products end-to-end, from API and data-layer work to polished frontend interfaces. I prioritize clear architecture, maintainable code, and measurable product outcomes.",
  jobTitle: "Full-Stack Developer",
  imagePath: "/user.png",
  email: "karel.cancara@gmail.com",
  linkedInUrl: "https://www.linkedin.com/in/kcancara",
  coreSkills: [
    "TypeScript, JavaScript, React, Next.js",
    ".NET / C# backend services and APIs",
    "SQL and data modeling",
    "AI-enhanced engineering workflows",
  ],
  knowsAbout: [
    "TypeScript",
    "React",
    "Next.js",
    ".NET",
    "AI-assisted software development",
  ],
  keyPages: ["/en", "/en/about", "/en/portfolio", "/en/cv"],
  languages: ["en", "da", "sv"],
} as const;

export const discoveryLinks = {
  profile: `${discoveryProfile.siteUrl}/profile`,
  image: `${discoveryProfile.siteUrl}${discoveryProfile.imagePath}`,
  emailMailto: `mailto:${discoveryProfile.email}`,
  about: `${discoveryProfile.siteUrl}/en/about`,
  cv: `${discoveryProfile.siteUrl}/en/cv`,
  linkedInDisplay: discoveryProfile.linkedInUrl.replace(/^https?:\/\//, ""),
} as const;
