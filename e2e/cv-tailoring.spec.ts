import { expect, Page, test } from "@playwright/test";

const screenshotDir = "/home/openclaw/work/repos/personal-website-3/public/images/project-stories/ai-job-application-platform";
const shouldCapture = process.env.UPDATE_CV_STORY_SCREENSHOTS === "1";
const sampleJobDescription = "Senior Full-Stack Developer with TypeScript, React, Node.js, APIs, product ownership, strong communication, and practical AI workflow experience.";

type CvBulletPoint = {
  text: string;
  id?: string;
  iconName?: string;
  url?: string | null;
  description?: string | null;
};

type CvParagraph = {
  text: string;
  id?: string;
};

type CvSection = {
  paragraphs?: CvParagraph[];
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

type MockCallState = {
  storiesRanked: number;
  lettersGenerated: number;
  cvsPersonalized: number;
};

async function maybeCapture(page: Page, fileName: string) {
  if (!shouldCapture) return;
  await page.screenshot({ path: `${screenshotDir}/${fileName}` });
}

async function pause(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function getExpectedSiteUrl(page: Page) {
  return page.evaluate(() => window.location.origin);
}

async function installCvMocks(page: Page, authenticatedInitially = false): Promise<MockCallState> {
  let authenticated = authenticatedInitially;
  const callState: MockCallState = {
    storiesRanked: 0,
    lettersGenerated: 0,
    cvsPersonalized: 0,
  };

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
    callState.storiesRanked += 1;
    await pause(250);
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
            content: "Built a workflow bridge between GitHub and Jira to reduce manual status syncing.",
          },
        ],
        selectionReasoning: "Highlights real workflow automation and delivery ownership.",
        useStories: true,
        totalAvailable: 1,
        _cacheInfo: { fromCache: false },
      }),
    });
  });

  await page.route("**/api/motivational-letter", async (route) => {
    callState.lettersGenerated += 1;
    await pause(300);
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
    callState.cvsPersonalized += 1;
    await pause(300);
    const body = JSON.parse(route.request().postData() || "{}") as PersonalizeCvRequest;
    const cv = structuredClone(body.cvBody);
    cv.subtitle = "Senior Full-Stack Developer | TypeScript, React, Node.js, APIs, AI workflows";

    if (cv.mainColumn?.[0]?.paragraphs?.length) {
      cv.mainColumn[0].paragraphs[0].text = "Full Stack Developer with 4+ years of experience building web applications and enterprise solutions. Strong focus on TypeScript, React, Node.js, product decisions, and AI-assisted workflow improvements.";
    }

    if (cv.mainColumn?.[1]?.bulletPoints?.length) {
      cv.mainColumn[1].bulletPoints[0].text = "Delivered backend services and APIs using .NET, Node.js, and C# while collaborating closely with frontend teams and product stakeholders.";
    }

    if (cv.sideColumn?.[3]?.bulletPoints?.length) {
      cv.sideColumn[3].bulletPoints.unshift({
        text: "AI workflows: Prompting, evaluation, automation",
        id: "e2e-added-bullet",
        iconName: "AutoAwesome",
        url: null,
        description: null,
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

  return callState;
}

async function openPasswordGate(page: Page) {
  await page.goto("/en/cv", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "CV" })).toBeVisible();
  await maybeCapture(page, "cv-public.png");

  const heading = page.getByRole("heading", { name: "CV" });
  const authHeading = page.getByRole("heading", { name: "Admin Authentication" });
  for (let attempt = 0; attempt < 4; attempt += 1) {
    for (let click = 0; click < 5; click += 1) {
      if (await authHeading.isVisible().catch(() => false)) {
        await maybeCapture(page, "cv-auth-modal.png");
        return;
      }
      await heading.click();
    }

    try {
      await expect(authHeading).toBeVisible({ timeout: 1000 });
      await maybeCapture(page, "cv-auth-modal.png");
      return;
    } catch {
      await page.waitForTimeout(500);
    }
  }

  await expect(authHeading).toBeVisible();
  await maybeCapture(page, "cv-auth-modal.png");
}

async function login(page: Page) {
  await page.getByRole("textbox", { name: "Admin Password" }).fill("irrelevant-in-mock-mode");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading", { name: "Admin Authentication" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Adjust for Position" })).toBeVisible();
}

async function openEditor(page: Page) {
  await openPasswordGate(page);
  await login(page);
}

async function openAuthenticatedEditor(page: Page) {
  await openEditor(page);
  await expect(page.getByRole("button", { name: "Adjust for Position" })).toBeVisible();
}

async function openAdjustForPosition(page: Page) {
  await page.getByRole("button", { name: "Adjust for Position" }).click({ force: true });
  await expect(page.getByRole("heading", { name: "Adjust CV for Position" })).toBeVisible();
}

async function personalizeCv(page: Page) {
  await openAdjustForPosition(page);
  const dialog = page.getByRole("dialog", { name: "Adjust CV for Position" });
  await dialog.getByRole("textbox", { name: "Job Description" }).fill(sampleJobDescription);

  const submitButton = dialog.getByRole("button", { name: "Adjust CV for Position" });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();
  await expect(page.getByRole("button", { name: "Hide Changes" })).toBeVisible({ timeout: 45000 });
}

test.describe("CV tailoring flow", () => {
  test.describe.configure({ timeout: 120000 });

  let callState: MockCallState;

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 1400 });
    await page.context().clearCookies();
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    callState = await installCvMocks(page);
  });

  test("reveals the hidden auth gate from the CV header", async ({ page }) => {
    await openPasswordGate(page);
  });

  test("unlocks edit mode after admin login", async ({ page }) => {
    await openPasswordGate(page);
    await login(page);
    await expect(page.getByRole("button", { name: "Adjust for Position" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Translate" })).toBeVisible();
  });

  test("opens the browser extension modal from edit mode", async ({ page }) => {
    test.setTimeout(45000);
    await openAuthenticatedEditor(page);
    await page.getByRole("button", { name: "Get Chrome Extension" }).click({ force: true });
    await expect(page.getByRole("heading", { name: "CV Tailor Chrome Extension" })).toBeVisible();
  });

  test("opens the translation modal from edit mode", async ({ page }) => {
    test.setTimeout(45000);
    await openAuthenticatedEditor(page);
    await page.getByRole("button", { name: "Translate" }).click({ force: true });
    await expect(page.getByRole("heading", { name: "Translate CV & Letter" })).toBeVisible();
  });

  test("applies mocked AI tailoring and renders the reviewable diff", async ({ page }) => {
    test.setTimeout(120000);
    await openAuthenticatedEditor(page);
    await personalizeCv(page);

    expect(callState.storiesRanked).toBe(1);
    expect(callState.cvsPersonalized).toBe(1);
    expect(callState.lettersGenerated).toBe(1);
    await expect(page.getByText("AI workflows: Prompting, evaluation, automation").first()).toBeVisible();
  });

  test("shows progress immediately while the mocked AI flow runs", async ({ page }) => {
    test.setTimeout(120000);
    await openAuthenticatedEditor(page);
    await openAdjustForPosition(page);

    const dialog = page.getByRole("dialog", { name: "Adjust CV for Position" });
    await dialog.getByRole("textbox", { name: "Job Description" }).fill(sampleJobDescription);
    await dialog.getByRole("button", { name: "Adjust CV for Position" }).click();

    await expect(page.getByText("Analyzing Position Requirements", { exact: true })).toBeVisible({ timeout: 2000 });
    await expect(page.getByText("Analyzing position requirements...", { exact: true })).toBeVisible({ timeout: 2000 });
    await expect(page.getByText("Tailoring CV", { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "Hide Changes" })).toBeVisible({ timeout: 45000 });

    expect(callState.storiesRanked).toBe(1);
    expect(callState.cvsPersonalized).toBe(1);
    expect(callState.lettersGenerated).toBe(1);
  });

  test("keeps change review enabled by default after tailoring completes", async ({ page }) => {
    test.setTimeout(120000);
    await openAuthenticatedEditor(page);
    await personalizeCv(page);

    await expect(page.getByRole("button", { name: "Hide Changes" })).toBeVisible();
    await expect(page.getByText("AI workflows: Prompting, evaluation, automation").first()).toBeVisible();
  });

  test("shows absolute work example URLs in edit mode", async ({ page }) => {
    test.setTimeout(45000);
    await openAuthenticatedEditor(page);
    const expectedAbsoluteProjectUrl =
      /https?:\/\/(?:127\.0\.0\.1|localhost):\d+\/en\/projects\/developer-task-overview-dashboard/;

    await expect(page.getByText(expectedAbsoluteProjectUrl).first()).toBeVisible();

    const dashboardLinks = page.locator('a[href$="/en/projects/developer-task-overview-dashboard"]');
    await expect(dashboardLinks.first()).toHaveAttribute("href", expectedAbsoluteProjectUrl);
  });

  test("keeps contact and project links clickable in edit mode", async ({ page }) => {
    test.setTimeout(45000);
    await openAuthenticatedEditor(page);

    await expect(page.getByRole("link", { name: "Open linkedin.com/in/kcancara link" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/kcancara"
    );
    await expect(page.getByRole("link", { name: "Open github.com/kacan98 link" })).toHaveAttribute(
      "href",
      "https://github.com/kacan98"
    );
    await expect(page.getByRole("link", { name: "Open Developer Task Overview Dashboard link" })).toHaveAttribute(
      "href",
      /https?:\/\/(?:127\.0\.0\.1|localhost):\d+\/en\/projects\/developer-task-overview-dashboard/
    );
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
