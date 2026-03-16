---
title: "Developer Task Overview Dashboard"
slug: "developer-task-overview-dashboard"
description: "Internal dashboard that combines Jira and GitHub into a single view for active tasks, PRs, failing checks, branch conflicts, and follow-up items."
image: "/images/projects/developer-task-overview-dashboard/overview-dashboard.png"
imageAlt: "Developer task dashboard combining Jira tasks, pull requests, action items, and follow-up work in one screen"
tech: ["Internal Tools", "Developer Tools", "Frontend"]
links:
  - title: "Project Story"
    url: "/en/projects/git-to-jira-bridge"
    iconName: "externalLink"
  - title: "Repo"
    url: "https://github.com/kacan98/track-current-task"
    iconName: "gitHub"
featured: true
order: 2
---

## Overview

This is an internal dashboard I built for a very practical problem: too much project state was spread across too many tabs.

During a normal workday I might need to know which Jira task is active, which pull request still has feedback, which build is red, whether a branch is ready for a PR, and whether something is already merged and waiting for testing. All of that information existed, but it was fragmented. The dashboard brings it into one place and turns it into a short list of things that need action.

![Developer task overview dashboard with Jira tasks, linked pull requests, and action priorities on a single page.](/images/projects/developer-task-overview-dashboard/overview-dashboard.png)

## What the dashboard surfaces first

The top of the page is designed to answer one question quickly: what should I deal with next?

Instead of just listing tickets and PRs, it highlights the work that is actually blocked or waiting. That includes merge conflicts, failed checks, requested changes, tasks that are ready for testing, and branches that exist but still need a pull request.

![Action summary showing merge conflicts, requested changes, failing checks, testing handoff, and branch-ready items.](/images/projects/developer-task-overview-dashboard/overview-action-items.png)

## Why the details matter

Each task card combines the Jira issue with the GitHub state around it. That means I can see review status, comment volume, recent activity, failed pipeline steps, and branch readiness without jumping between tools to reconstruct the story by hand.

![Detailed task card showing a failing pull request, check status, and recent review activity connected to the Jira task.](/images/projects/developer-task-overview-dashboard/overview-task-card.png)

## Why I built it

I wanted one screen that reduces context switching and makes follow-up work obvious. It is a developer-facing tool, but the value is straightforward: less overhead, fewer missed handoffs, and a faster path from "something needs attention" to "I know exactly what to do next."
