import { discoveryLinks, discoveryProfile } from "@/lib/profile-discovery";

export const dynamic = "force-static";

export function GET() {
  const content = [
    `# ${discoveryProfile.name}`,
    "",
    discoveryProfile.headline,
    "",
    "## Canonical profile",
    `- ${discoveryLinks.profile}`,
    "",
    "## Key pages",
    ...discoveryProfile.keyPages.map((path) => `- ${discoveryProfile.siteUrl}${path}`),
    "",
    "## External",
    `- ${discoveryProfile.linkedInUrl}`,
    "",
    "## Contact",
    `- ${discoveryLinks.emailMailto}`,
  ].join("\n");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
