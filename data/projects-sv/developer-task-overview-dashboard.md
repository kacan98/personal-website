---
title: "Utvecklardashboard"
description: "Intern dashboard som samlar Jira och GitHub i en vy för aktiva uppgifter, PR:er, felande checks, branch conflicts och uppföljning."
image: "/images/projects/developer-task-overview-dashboard.svg"
tech: ["TypeScript", "React", "Node.js", "GitHub API", "Jira API"]
links:
  - title: "Project Story"
    url: "/sv/project-stories/git-jira-bridge"
    iconName: "externalLink"
  - title: "Repo"
    url: "https://github.com/kacan98/track-current-task"
    iconName: "gitHub"
featured: true
order: 2
---

## Översikt

En personlig intern dashboard byggd för att minska context switching i utvecklingsarbete genom att samla GitHub- och Jira-uppföljning i en operativ vy.

## Vad den visar

- Aktiva Jira-uppgifter som pågår
- Öppna pull requests och review-status
- Felande pipelines och checks
- Branch conflicts och uppföljningspunkter
- Kommentarer som fortfarande kräver åtgärd

## Varför jag byggde den

Jag ville ha ett ställe där jag kunde se vad som fortfarande behövde åtgärd istället för att hela tiden kontrollera flera verktyg och sidor. Det minskar mental overhead, gör det lättare att hålla arbetet i rörelse och sänker risken att missa något viktigt.
