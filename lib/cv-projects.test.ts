import { afterEach, describe, expect, it, vi } from "vitest";

describe("getCVProjectsSection", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns absolute URLs for curated work examples", async () => {
    vi.stubEnv("NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL", "portfolio.example.com");

    const { getCVProjectsSection } = await import("./cv-projects");
    const section = await getCVProjectsSection("en");

    const projectLinks = section.bulletPoints?.map((bulletPoint) => bulletPoint.url) ?? [];

    expect(projectLinks.length).toBeGreaterThan(0);
    expect(projectLinks.every((url) => url?.startsWith("https://portfolio.example.com/en/projects/"))).toBe(true);
    expect(projectLinks).toContain("https://portfolio.example.com/en/projects/developer-task-overview-dashboard");
  });
});
