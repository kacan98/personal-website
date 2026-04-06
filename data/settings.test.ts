import { afterEach, describe, expect, it, vi } from "vitest";

async function loadSettingsModule() {
  vi.resetModules();
  return import("./settings");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("settings site URL resolution", () => {
  it("uses the public Vercel production URL for absolute links", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL", "portfolio.example.com");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");

    const { settings, toAbsoluteSiteUrl } = await loadSettingsModule();

    expect(settings.siteUrl).toBe("https://portfolio.example.com");
    expect(toAbsoluteSiteUrl("/en/projects/developer-task-overview-dashboard")).toBe(
      "https://portfolio.example.com/en/projects/developer-task-overview-dashboard"
    );
  });

  it("falls back to the server-side Vercel production URL when needed", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "portfolio.example.com");

    const { settings } = await loadSettingsModule();

    expect(settings.siteUrl).toBe("https://portfolio.example.com");
  });

  it("uses localhost in development when no deployment URL is available", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");

    const { settings, toAbsoluteSiteUrl } = await loadSettingsModule();

    expect(settings.siteUrl).toBe("http://localhost:3000");
    expect(toAbsoluteSiteUrl("/en/projects/developer-task-overview-dashboard")).toBe(
      "http://localhost:3000/en/projects/developer-task-overview-dashboard"
    );
  });
});
