import { SITE_NAME, SITE_URL } from "@/lib/site-metadata";
import { PROJECTS_PATH } from "@/lib/routes";

export const dynamic = "force-static";

export function GET() {
  const content = [
    `# ${SITE_NAME}`,
    "",
    "Full-stack developer focused on TypeScript, React, .NET, X++, and practical internal tooling.",
    "",
    "## Canonical profile",
    `- ${SITE_URL}/profile`,
    "",
    "## Key pages",
    `- ${SITE_URL}/en`,
    `- ${SITE_URL}/en/about`,
    `- ${SITE_URL}/en${PROJECTS_PATH}`,
    `- ${SITE_URL}/en/cv`,
    "",
    "## External",
    "- https://www.linkedin.com/in/kcancara",
    "- https://github.com/kacan98",
    "",
    "## Contact",
    "- mailto:karel@cancara.dk",
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
