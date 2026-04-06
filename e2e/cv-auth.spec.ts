import { expect, test } from "@playwright/test";

const cvAdminPassword = process.env.CV_ADMIN_PASSWORD ?? "local-dev-password";

test.describe("CV auth gate", () => {
  test.describe.configure({ timeout: 120000 });

  async function openPasswordGate(page: import("@playwright/test").Page) {
    await page.goto("/en/cv", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "CV" })).toBeVisible();

    const heading = page.getByRole("heading", { name: "CV" });
    const authHeading = page.getByRole("heading", { name: "Admin Authentication" });

    for (let attempt = 0; attempt < 4; attempt += 1) {
      for (let click = 0; click < 5; click += 1) {
        if (await authHeading.isVisible().catch(() => false)) {
          return;
        }
        await heading.click();
      }

      try {
        await expect(authHeading).toBeVisible({ timeout: 1000 });
        return;
      } catch {
        await page.waitForTimeout(500);
      }
    }

    await expect(authHeading).toBeVisible();
  }

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 1400 });
    await page.context().clearCookies();
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    let authenticated = false;
    let failedAttempts = 0;

    await page.route("**/api/auth/status", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          authenticated,
          message: authenticated ? "Authenticated" : "Not authenticated",
        }),
      });
    });

    await page.route("**/api/auth/login", async (route) => {
      const body = route.request().postDataJSON() as { password?: string };

      if (body.password === cvAdminPassword) {
        authenticated = true;
        failedAttempts = 0;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, message: "Authentication successful" }),
        });
        return;
      }

      failedAttempts += 1;
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Invalid password",
          remainingAttempts: Math.max(0, 5 - failedAttempts),
        }),
      });
    });

    await openPasswordGate(page);
  });

  test("decrements remaining attempts on each incorrect password", async ({ page }) => {
    const passwordField = page.getByRole("textbox", { name: "Admin Password" });
    const loginButton = page.getByRole("button", { name: "Login" });

    for (const attemptsRemaining of [4, 3, 2]) {
      await passwordField.fill(`wrong-password-${attemptsRemaining}`);
      await loginButton.click();
      await expect(page.getByRole("alert")).toContainText(`${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining`);
    }
  });

  test("unlocks CV editing after the correct password", async ({ page }) => {
    await page.getByRole("textbox", { name: "Admin Password" }).fill(cvAdminPassword);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("heading", { name: "Admin Authentication" })).not.toBeVisible();
    await expect(page.getByText("Now you can edit")).toBeVisible();
    await expect(page.getByRole("button", { name: "Adjust for Position" })).toBeVisible();
  });
});
