---
title: "Developer Task Overview Dashboard"
description: "Internal dashboard that combines Jira and GitHub into a single view for active tasks, PRs, failing checks, branch conflicts, and follow-up items."
image: "/images/projects/developer-task-overview-dashboard.svg"
tech: ["TypeScript", "React", "Node.js", "GitHub API", "Jira API"]
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

A personal internal dashboard built to reduce context switching during development work by combining GitHub and Jira follow-up into one operational view.

## What it shows

- Active Jira tasks in progress
- Open pull requests and review status
- Failing pipelines and checks
- Branch conflicts and follow-up items
- Comments that still need attention

## Why I built it

I wanted one place to see what still needed action instead of repeatedly checking multiple tools and pages. It reduces mental overhead, makes it easier to keep work moving, and lowers the risk of missing something important.
