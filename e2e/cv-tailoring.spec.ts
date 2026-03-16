import { expect, Page, test } from "@playwright/test";

const screenshotDir = "/home/openclaw/work/repos/personal-website-3/public/images/project-stories/ai-job-application-platform";
const shouldCapture = process.env.UPDATE_CV_STORY_SCREENSHOTS === "1";
const sampleJobDescription = "Senior Full-Stack Developer with TypeScript, React, Node.js, APIs, product ownership, strong communication, and practical AI workflow experience.";

type CvBulletPoint = {
  text: string;
  id?: string;
};

type CvSection = {
  paragraphs?: string[];
  bulletPoints?: CvBulletPoint[];
};

type EditableCv = {
  subtitle?: string;
  mainColumn?: CvSection[];
  sideColumn?: CvSection[];
  [key: string]: unknown;
};

type PersonalizeCvRequest = {
  cvBody: EditableCv;
  positionWeAreApplyingFor: string;
};

async function maybeCapture(page: Page, fileName: string) {
  if (!shouldCapture) return;
  await page.screenshot({ path: `${screenshotDir}/${fileName}` });
}

async function installCvMocks(page: Page) {
  let authenticated = false;

  await page.route("**/api/auth/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ authenticated, message: authenticated ? "Authenticated" : "Not authenticated" }),
    });
  });

  await page.route("**/api/auth/login", async (route) => {
    authenticated = true;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, message: "Authentication successful" }),
    });
  });

  await page.route("**/api/stories/rank", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        selectedStories: [
          {
            id: "git-jira-bridge",
            title: "Git-to-Jira Bridge",
            category: "automation",
            relevance: 0.98,
            tags: ["Automation", "GitHub", "Jira"],
            url: "/en/project-stories/git-jira-bridge",
            fullUrl: "https://example.com/en/project-stories/git-jira-bridge",
          },
        ],
        selectionReasoning: "Highlights real workflow automation and delivery ownership.",
        useStories: true,
        _cacheInfo: { fromCache: false },
      }),
    });
  });

  await page.route("**/api/motivational-letter", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        letter: "I build practical workflow tools that reduce context switching and make teams move faster.",
        selectedStories: [],
        _cacheInfo: { fromCache: false },
      }),
    });
  });

  await page.route("**/api/personalize-cv", async (route) => {
    const body = route.request().postDataJSON() as PersonalizeCvRequest;
    const cv = structuredClone(body.cvBody);
    cv.subtitle = "Senior Full-Stack Developer | TypeScript, React, Node.js, APIs, AI workflows";

    if (cv.mainColumn?.[0]?.paragraphs?.length) {
      cv.mainColumn[0].paragraphs[0] = "Full Stack Developer with 4+ years of experience building web applications and enterprise solutions. Strong focus on TypeScript, React, Node.js, product decisions, and AI-assisted workflow improvements.";
    }

    if (cv.mainColumn?.[1]?.bulletPoints?.length) {
      cv.mainColumn[1].bulletPoints[0].text = "Delivered backend services and APIs using .NET, Node.js, and C# while collaborating closely with frontend teams and product stakeholders.";
    }

    if (cv.sideColumn?.[3]?.bulletPoints?.length) {
      cv.sideColumn[3].bulletPoints.unshift({
        text: "AI workflows: Prompting, evaluation, automation",
        id: "e2e-added-bullet",
      });
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        cv,
        newPositionSummary: "Senior full-stack role with product ownership and AI workflow emphasis.",
        companyName: "Demo Company",
        newJobIntersection: {
          rating: 8,
          whatIsGood: ["Strong TypeScript experience", "Practical product ownership"],
          potentialImprovements: ["Make AI workflow experience more visible"],
          missingFromCV: ["None critical"],
        },
        _cacheInfo: { fromCache: false },
      }),
    });
  });
}

async function openPasswordGate(page: Page) {
  await page.goto("/en/cv", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "CV" })).toBeVisible();
  await maybeCapture(page, "cv-public.png");

  const heading = page.getByRole("heading", { name: "CV" });
  for (let i = 0; i < 5; i += 1) {
    await heading.click();
  }

  await expect(page.getByRole("heading", { name: "Admin Authentication" })).toBeVisible();
  await maybeCapture(page, "cv-auth-modal.png");
}

async function login(page: Page) {
  await page.getByRole("textbox", { name: "Admin Password" }).fill("irrelevant-in-mock-mode");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Now you can edit")).toBeVisible();
}

async function openEditor(page: Page) {
  await openPasswordGate(page);
  await login(page);
}

async function openAdjustForPosition(page: Page) {
  await page.getByRole("button", { name: "Adjust for Position" }).click({ force: true });
  await expect(page.getByRole("heading", { name: "Adjust CV for Position" })).toBeVisible();
}

async function personalizeCv(page: Page) {
  await openAdjustForPosition(page);
  await page.getByRole("textbox", { name: "Job Description" }).fill(sampleJobDescription);
  await page.getByRole("button", { name: "Adjust CV for Position" }).click({ force: true });
  await expect(page.getByRole("button", { name: "Show Changes" })).toBeVisible({ timeout: 15000 });
}

test.describe("CV tailoring flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 1400 });
    await installCvMocks(page);
  });

  test("reveals the hidden auth gate from the CV header", async ({ page }) => {
    await page.goto("/en/cv", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "CV" })).toBeVisible();

    const heading = page.getByRole("heading", { name: "CV" });
    for (let i = 0; i < 5; i += 1) {
      await heading.click();
    }

    await expect(page.getByRole("heading", { name: "Admin Authentication" })).toBeVisible();
  });

  test("unlocks edit mode after admin login", async ({ page }) => {
    await openPasswordGate(page);
    await login(page);
    await expect(page.getByRole("button", { name: "Adjust for Position" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Translate" })).toBeVisible();
  });

  test("opens the browser extension modal from edit mode", async ({ page }) => {
    test.setTimeout(45000);
    await openEditor(page);
    await page.getByRole("button", { name: "Get Chrome Extension" }).click({ force: true });
    await expect(page.getByRole("heading", { name: "CV Tailor Chrome Extension" })).toBeVisible();
  });

  test("opens the translation modal from edit mode", async ({ page }) => {
    test.setTimeout(45000);
    await openEditor(page);
    await page.getByRole("button", { name: "Translate" }).click({ force: true });
    await expect(page.getByRole("heading", { name: "Translate CV & Letter" })).toBeVisible();
  });

  test("applies mocked AI tailoring and renders the reviewable diff", async ({ page }) => {
    test.setTimeout(60000);
    await openEditor(page);
    await personalizeCv(page);

    await page.getByRole("button", { name: "Show Changes" }).click({ force: true });
    await expect(page.getByText("AI workflows: Prompting, evaluation, automation").first()).toBeVisible();
    await expect(page.getByText(/Senior Full-Stack Developer \| TypeScript, React, Node\.js, APIs, AI workflows/).first()).toBeVisible();
  });

  test("captures the article screenshots from the same mocked workflow", async ({ page }) => {
    test.skip(!shouldCapture, "Screenshot refresh only runs when explicitly requested.");
    test.setTimeout(120000);

    await openPasswordGate(page);
    await login(page);
    await maybeCapture(page, "cv-edit-mode.png");

    await page.getByRole("button", { name: "Get Chrome Extension" }).click({ force: true });
    await expect(page.getByRole("heading", { name: "CV Tailor Chrome Extension" })).toBeVisible();
    await maybeCapture(page, "cv-extension-modal.png");
    await page.keyboard.press("Escape");

    await openAdjustForPosition(page);
    await page.getByRole("textbox", { name: "Job Description" }).fill(sampleJobDescription);
    await page.waitForTimeout(350);
    await maybeCapture(page, "cv-manual-adjustment.png");
    await page.getByRole("button", { name: "Adjust CV for Position" }).click({ force: true });

    await expect(page.getByRole("button", { name: "Show Changes" })).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "Show Changes" }).click({ force: true });
    await expect(page.getByText("AI workflows: Prompting, evaluation, automation").first()).toBeVisible();
    await maybeCapture(page, "cv-ai-diff-view.png");

    await page.getByRole("button", { name: "Translate" }).click({ force: true });
    await expect(page.getByRole("heading", { name: "Translate CV & Letter" })).toBeVisible();
    await maybeCapture(page, "cv-translation-modal.png");
  });
});
