import {
  CONTACT_EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  PROFILE_HEADLINE,
  SITE_NAME,
  SITE_URL,
  getLlmsKeyPages,
} from "@/lib/site-metadata";

export const dynamic = "force-static";

export function GET() {
  const content = [
    `# ${SITE_NAME}`,
    "",
    PROFILE_HEADLINE,
    "",
    "## Canonical profile",
    `- ${SITE_URL}/profile`,
    "",
    "## Key pages",
    ...getLlmsKeyPages().map((path) => `- ${SITE_URL}/en${path}`),
    "",
    "## External",
    `- ${LINKEDIN_URL}`,
    `- ${GITHUB_URL}`,
    "",
    "## Contact",
    `- mailto:${CONTACT_EMAIL}`,
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
