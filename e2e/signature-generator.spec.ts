import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    __copiedHtml?: string;
    __copiedText?: string;
  }
}

const tinyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4nGP8z8DQwMDAwMDEAAUAGCUBg0vOLLsAAAAASUVORK5CYII=";

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

  test("renders the default signature with hosted compressed assets", async ({ page }) => {
    const previewImage = page.locator('img[alt="Karel Čančara"]').first();
    await expect(previewImage).toBeVisible();
    await expect(previewImage).toHaveAttribute("src", /\/images\/email-signature\/profile-96\.jpg$/);

    const previewHtml = await page.getByTestId("signature-preview-card").innerHTML();
    expect(previewHtml).toContain("/images/email-signature-icons/linkedin.png");
    expect(previewHtml).not.toContain("data:image/svg+xml");
  });

  test("copy button outputs hosted html without inline payloads for the default avatar", async ({ page }) => {
    await page.getByTestId("signature-copy-button").click();
    await expect.poll(async () => page.evaluate(() => window.__copiedHtml || "")).not.toEqual("");

    const copiedHtml = await page.evaluate(() => window.__copiedHtml || "");
    expect(copiedHtml).toContain("/images/email-signature/profile-96.jpg");
    expect(copiedHtml).toContain("/images/email-signature-icons/linkedin.png");
    expect(copiedHtml).toContain('width="64" height="64"');
    expect(copiedHtml).toContain("max-width: 64px; max-height: 64px");
    expect(copiedHtml).not.toContain("data:image");
    expect(copiedHtml).not.toContain("blob:");
  });

  test("uploaded avatars are compressed inline and manual copy matches the button", async ({ page }) => {
    await page.locator('input[type="file"]').first().setInputFiles({
      name: "avatar.png",
      mimeType: "image/png",
      buffer: Buffer.from(tinyPngBase64, "base64"),
    });

    const previewImage = page.locator('img[alt="Karel Čančara"]').first();
    await expect(previewImage).toHaveAttribute("src", /^data:image\/jpeg;base64,/);

    await page.getByTestId("signature-copy-button").click();
    await expect.poll(async () => page.evaluate(() => window.__copiedHtml || "")).not.toEqual("");
    const buttonHtml = await page.evaluate(() => window.__copiedHtml || "");

    const selectionHtml = await page.getByTestId("signature-preview-card").evaluate((element) => {
      const data = new DataTransfer();
      const event = new Event("copy", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "clipboardData", { value: data });
      element.dispatchEvent(event);
      return data.getData("text/html");
    });

    expect(buttonHtml).toContain("data:image/jpeg;base64,");
    expect(buttonHtml).not.toContain("blob:");
    expect(selectionHtml).toEqual(buttonHtml);
  });
});
