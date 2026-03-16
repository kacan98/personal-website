import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.DASHBOARD_BASE_URL || 'http://127.0.0.1:4301';
const outputDir = '/home/openclaw/work/repos/personal-website-3/public/images/projects/developer-task-overview-dashboard';

const jiraIssues = [
  {
    key: 'PROJ-142',
    fields: {
      summary: 'Ship recruiter-friendly CV tailoring story with screenshots',
      status: {
        name: 'In Progress',
        statusCategory: { name: 'In Progress', colorName: 'blue-gray' }
      },
      priority: { name: 'High' },
      issuetype: { name: 'Story' },
      subtasks: [
        {
          key: 'PROJ-151',
          fields: {
            summary: 'QA the article on mobile and desktop',
            status: { name: 'To Do' }
          }
        }
      ],
      issuelinks: [
        {
          type: { name: 'Relates', inward: 'relates to', outward: 'relates to' },
          outwardIssue: {
            key: 'PROJ-143',
            fields: {
              summary: 'Add fresh screenshots from demo data',
              status: { name: 'In Progress' }
            }
          }
        }
      ]
    }
  },
  {
    key: 'PROJ-188',
    fields: {
      summary: 'Investigate why CI occasionally fails on the integration branch',
      status: {
        name: 'In Progress',
        statusCategory: { name: 'In Progress', colorName: 'blue-gray' }
      },
      priority: { name: 'Highest' },
      issuetype: { name: 'Bug' },
      subtasks: [],
      issuelinks: []
    }
  },
  {
    key: 'PROJ-201',
    fields: {
      summary: 'Wrap up merged work and hand over to testing',
      status: {
        name: 'In Progress',
        statusCategory: { name: 'In Progress', colorName: 'blue-gray' }
      },
      priority: { name: 'Medium' },
      issuetype: { name: 'Task' },
      subtasks: [
        {
          key: 'PROJ-202',
          fields: {
            summary: 'Test merged branch in staging',
            status: { name: 'To Do' }
          }
        }
      ],
      issuelinks: []
    }
  },
  {
    key: 'PROJ-233',
    fields: {
      summary: 'Prepare dashboard release branch for a follow-up PR',
      status: {
        name: 'To Do',
        statusCategory: { name: 'To Do', colorName: 'medium-gray' }
      },
      priority: { name: 'Low' },
      issuetype: { name: 'Task' },
      subtasks: [],
      issuelinks: []
    }
  }
];

const pullRequests = [
  {
    taskId: 'PROJ-142',
    number: 87,
    title: 'PROJ-142 Improve the CV tailoring article structure',
    state: 'open',
    draft: false,
    url: 'https://github.com/kacan98/personal-website/pull/87',
    branch: 'feature/proj-142-story-refresh',
    repository: { name: 'personal-website', fullName: 'kacan98/personal-website' },
    createdAt: '2026-03-14T09:10:00.000Z',
    updatedAt: '2026-03-16T11:45:00.000Z',
    merged: false,
    comments: 3,
    reviewComments: 2,
    changesRequested: true,
    lastCommitDate: '2026-03-15T08:30:00.000Z',
    lastReviewDate: '2026-03-15T12:15:00.000Z',
    lastReviewState: 'changes_requested',
    mergeable: true,
    mergeableState: 'blocked',
    reviewStatus: {
      state: 'changes_requested',
      reviewers: [
        { login: 'frontend-lead', avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4', state: 'changes_requested' }
      ]
    },
    checkStatus: {
      state: 'success',
      total: 4,
      passed: 4,
      failed: 0,
      pending: 0,
      checks: []
    }
  },
  {
    taskId: 'PROJ-188',
    number: 91,
    title: 'PROJ-188 Stabilize the flaky integration test lane',
    state: 'open',
    draft: false,
    url: 'https://github.com/kacan98/track-current-task/pull/91',
    branch: 'bugfix/proj-188-ci-investigation',
    repository: { name: 'track-current-task', fullName: 'kacan98/track-current-task' },
    createdAt: '2026-03-13T14:20:00.000Z',
    updatedAt: '2026-03-16T10:20:00.000Z',
    merged: false,
    comments: 1,
    reviewComments: 4,
    changesRequested: false,
    lastCommitDate: '2026-03-16T09:55:00.000Z',
    lastReviewDate: '2026-03-15T17:10:00.000Z',
    lastReviewState: 'commented',
    mergeable: true,
    mergeableState: 'unstable',
    reviewStatus: {
      state: 'commented',
      reviewers: [
        { login: 'qa-engineer', avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4', state: 'commented' }
      ]
    },
    checkStatus: {
      state: 'failure',
      total: 5,
      passed: 3,
      failed: 2,
      pending: 0,
      checks: [
        {
          id: 7001,
          name: 'Integration tests',
          status: 'completed',
          conclusion: 'failure',
          url: 'https://github.com/kacan98/track-current-task/actions/runs/7001',
          failedStep: 'overview.spec.ts',
          errorMessage: 'Expected action summary badge to be visible.'
        },
        {
          id: 7002,
          name: 'Build',
          status: 'completed',
          conclusion: 'failure',
          url: 'https://github.com/kacan98/track-current-task/actions/runs/7002',
          failedStep: 'vite build',
          errorMessage: 'Type mismatch in PullRequestCard props.'
        }
      ]
    }
  },
  {
    taskId: 'PROJ-201',
    number: 76,
    title: 'PROJ-201 Finish dashboard filtering before handoff',
    state: 'closed',
    draft: false,
    url: 'https://github.com/kacan98/track-current-task/pull/76',
    branch: 'feature/proj-201-ready-for-testing',
    repository: { name: 'track-current-task', fullName: 'kacan98/track-current-task' },
    createdAt: '2026-03-10T08:00:00.000Z',
    updatedAt: '2026-03-14T16:00:00.000Z',
    merged: true,
    mergedAt: '2026-03-14T16:00:00.000Z',
    comments: 2,
    reviewComments: 1,
    changesRequested: false,
    lastCommitDate: '2026-03-14T12:00:00.000Z',
    lastReviewDate: '2026-03-14T13:00:00.000Z',
    lastReviewState: 'approved',
    mergeable: null,
    mergeableState: 'unknown',
    reviewStatus: {
      state: 'approved',
      reviewers: [
        { login: 'staff-engineer', avatarUrl: 'https://avatars.githubusercontent.com/u/3?v=4', state: 'approved' }
      ]
    },
    checkStatus: {
      state: 'success',
      total: 4,
      passed: 4,
      failed: 0,
      pending: 0,
      checks: []
    }
  }
];

const branchesByTask = {
  'PROJ-233': [
    {
      name: 'feature/proj-233-release-prep',
      repository: { name: 'track-current-task', fullName: 'kacan98/track-current-task' },
      createPrUrl: 'https://github.com/kacan98/track-current-task/compare/main...feature/proj-233-release-prep?expand=1',
      lastCommitDate: '2026-03-16T07:40:00.000Z'
    }
  ]
};

async function fulfillJson(route, body) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body)
  });
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });

  await page.addInitScript(() => {
    localStorage.setItem('jiraBaseUrl', 'https://example.atlassian.net');
    localStorage.setItem('taskIdRegex', 'PROJ-\\d+');
    localStorage.setItem('githubUsername', 'kacan98');
  });

  await page.route('**/api/jira/auth/status', route => fulfillJson(route, { authenticated: true }));
  await page.route('**/api/github/auth/status', route => fulfillJson(route, {
    authenticated: true,
    user: {
      login: 'kacan98',
      name: 'Karel Cancara',
      avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4'
    }
  }));
  await page.route('**/api/jira/tasks/assigned', route => fulfillJson(route, { issues: jiraIssues }));
  await page.route('**/api/github/pulls/search', route => fulfillJson(route, { pullRequests }));
  await page.route('**/api/github/branches/search?*', async route => {
    const url = new URL(route.request().url());
    const taskId = url.searchParams.get('taskId') || '';
    await fulfillJson(route, { branches: branchesByTask[taskId] || [] });
  });
  await page.route(/\/api\/github\/pulls\/[^/]+\/[^/]+\/\d+$/, route => {
    const requestUrl = route.request().url();
    const match = requestUrl.match(/\/pulls\/([^/]+)\/([^/]+)\/(\d+)$/);
    const prNumber = match ? Number(match[3]) : 0;
    const pullRequest = pullRequests.find(pr => pr.number === prNumber);
    return fulfillJson(route, { pullRequest });
  });
  await page.route('**/api/github/checks/*/*/*/rerun', route => fulfillJson(route, { success: true }));
  await page.route('**/api/github/pulls/*/*/*/request-review', route => fulfillJson(route, { success: true }));

  console.log(`Opening ${baseUrl}/tasks`);
  await page.goto(`${baseUrl}/tasks`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'My Tasks' }).waitFor({ timeout: 15000 });
  await page.getByRole('heading', { name: /Action Items/ }).waitFor({ timeout: 15000 });
  console.log('Dashboard loaded');

  const actionSummary = page.locator('div.bg-white.rounded-lg.border.border-gray-200.shadow-sm.p-4.mb-6').first();
  await actionSummary.screenshot({
    path: path.join(outputDir, 'overview-action-items.png')
  });

  await page.getByRole('button', { name: /Other Tasks/ }).click();
  await page.getByRole('link', { name: 'PROJ-233' }).nth(1).waitFor({ timeout: 15000 });
  console.log('Capturing screenshots');

  const mainContent = page.locator('.max-w-7xl').first();
  await mainContent.screenshot({
    path: path.join(outputDir, 'overview-dashboard.png')
  });

  const failedChecksCard = page.locator('div.bg-white.rounded-lg.border.border-gray-300.shadow-md').filter({
    has: page.getByText('PROJ-188')
  }).first();
  await failedChecksCard.screenshot({
    path: path.join(outputDir, 'overview-task-card.png')
  });

  console.log('Dashboard screenshots written');
  await browser.close();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
