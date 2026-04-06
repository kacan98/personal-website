import { expect, test } from "@playwright/test";

test.describe("CV auth gate", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(45000);
    await page.setViewportSize({ width: 1000, height: 1400 });
    await page.goto("/en/cv", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "CV" })).toBeVisible();

    const heading = page.getByRole("heading", { name: "CV" });
    for (let i = 0; i < 5; i += 1) {
      await heading.click();
    }

    await expect(page.getByRole("heading", { name: "Admin Authentication" })).toBeVisible();
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
    await page.getByRole("textbox", { name: "Admin Password" }).fill(process.env.CV_ADMIN_PASSWORD ?? "");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("heading", { name: "Admin Authentication" })).not.toBeVisible();
    await expect(page.getByText("Now you can edit")).toBeVisible();
    await expect(page.getByRole("button", { name: "Adjust for Position" })).toBeVisible();
  });
});
