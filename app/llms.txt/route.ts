const siteUrl = "https://kcancara.vercel.app";

export const dynamic = "force-static";

export function GET() {
  const content = [
    "# Karel Čančara",
    "",
    "Full-stack developer focused on TypeScript, React, .NET, and AI-enhanced product development.",
    "",
    "## Canonical profile",
    `- ${siteUrl}/profile`,
    "",
    "## Key pages",
    `- ${siteUrl}/en`,
    `- ${siteUrl}/en/about`,
    `- ${siteUrl}/en/portfolio`,
    `- ${siteUrl}/en/cv`,
    "",
    "## External",
    "- https://www.linkedin.com/in/kcancara",
    "",
    "## Contact",
    "- mailto:karel.cancara@gmail.com",
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
