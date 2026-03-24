import { expect, test, type Page } from "@playwright/test";

declare global {
  interface Window {
    __copiedHtml?: string;
    __copiedText?: string;
  }
}

const tinyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8DQwMDAwMDEAAUAGCUBg0vOLLsAAAAASUVORK5CYII=";

const readCopiedHtml = async (page: Page) => {
  await expect.poll(async () => page.evaluate(() => window.__copiedHtml || "")).not.toEqual("");
  return page.evaluate(() => window.__copiedHtml || "");
};

const readSelectionHtml = async (page: Page) => {
  return page.getByTestId("signature-preview-card").evaluate((element: HTMLElement) => {
    const data = new DataTransfer();
    const event = new Event("copy", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "clipboardData", { value: data });
    element.dispatchEvent(event);
    return data.getData("text/html");
  });
};

test.describe("signature generator", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => {
      window.__copiedHtml = "";
      window.__copiedText = "";

      const clipboard = navigator.clipboard;
      clipboard.write = async (items: ClipboardItem[]) => {
        for (const item of items) {
          if (item.types.includes("text/html")) {
            const blob = await item.getType("text/html");
            window.__copiedHtml = await blob.text();
          }
          if (item.types.includes("text/plain")) {
            const blob = await item.getType("text/plain");
            window.__copiedText = await blob.text();
          }
        }
      };
      clipboard.writeText = async (text: string) => {
        window.__copiedText = text;
      };
    });

    await page.setViewportSize({ width: 1280, height: 1400 });
    await page.goto("/en/signature-generator", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Email Signature Generator" })).toBeVisible();
  });

  test("default signature uses hosted preset assets", async ({ page }) => {
    const previewImage = page.locator('img[alt="Karel Čančara"]').first();
    await expect(previewImage).toBeVisible();
    await expect(previewImage).toHaveAttribute("src", /\/images\/email-signature\/profile-96\.jpg$/);

    const previewHtml = await page.getByTestId("signature-preview-card").innerHTML();
    expect(previewHtml).toContain("/images/email-signature-icons/presets/professional-blue/linkedin.png");
    expect(previewHtml).not.toContain("data:image/svg+xml");
  });

  test("switching preset changes hosted icon set", async ({ page }) => {
    await page.getByRole("tab", { name: "STYLING" }).click();
    await page.getByText("Modern Purple", { exact: true }).click();
    await page.getByTestId("signature-copy-button").click();

    const copiedHtml = await readCopiedHtml(page);
    expect(copiedHtml).toContain("/images/email-signature-icons/presets/modern-purple/linkedin.png");
    expect(copiedHtml).not.toContain("/images/email-signature-icons/presets/professional-blue/linkedin.png");
    expect(copiedHtml).not.toContain("data:image/png;base64");
  });

  test("custom icon colors export inline png icons", async ({ page }) => {
    await page.getByRole("tab", { name: "STYLING" }).click();
    await page.getByText("Advanced: Custom Colors", { exact: true }).click();
    await page.getByTestId("signature-icon-color-text").locator('input').fill("#ff4f00");
    await page.getByTestId("signature-copy-button").click();

    const copiedHtml = await readCopiedHtml(page);
    expect(copiedHtml).toContain("data:image/png;base64,");
    expect(copiedHtml).not.toContain("/images/email-signature-icons/presets/");
    expect(copiedHtml).not.toContain("data:image/svg+xml");
  });

  test("uploaded avatars stay inline and selection copy matches button copy", async ({ page }) => {
    await page.locator('input[type="file"]').first().setInputFiles({
      name: "avatar.png",
      mimeType: "image/png",
      buffer: Buffer.from(tinyPngBase64, "base64"),
    });

    const previewImage = page.locator('img[alt="Karel Čančara"]').first();
    await expect(previewImage).toHaveAttribute("src", /^data:image\/jpeg;base64,/);

    await page.getByTestId("signature-copy-button").click();
    const buttonHtml = await readCopiedHtml(page);
    const selectionHtml = await readSelectionHtml(page);

    expect(buttonHtml).toContain("data:image/jpeg;base64,");
    expect(buttonHtml).not.toContain("blob:");
    expect(selectionHtml).toEqual(buttonHtml);
  });
});
