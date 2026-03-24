---
title: "Utvecklardashboard"
description: "Intern dashboard som samlar Jira och GitHub i en vy för aktiva uppgifter, PR:er, felande checks, branch conflicts och uppföljning."
image: "/images/projects/developer-task-overview-dashboard/overview-dashboard.png"
imageAlt: "Utvecklardashboard som samlar Jira-uppgifter, pull requests, åtgärdspunkter och uppföljning i en vy"
tech: ["Internal Tools", "Developer Tools", "Frontend"]
links:
  - title: "Project Story"
    url: "/sv/projects/git-to-jira-bridge"
    iconName: "externalLink"
  - title: "Repo"
    url: "https://github.com/kacan98/track-current-task"
    iconName: "gitHub"
featured: true
order: 2
---

## Översikt

Det här är en intern dashboard som jag byggde för ett väldigt praktiskt problem: för mycket projektstatus var utspridd över för många flikar.

Under en vanlig arbetsdag kan jag behöva veta vilken Jira-uppgift som är aktiv, vilken pull request som fortfarande väntar på feedback, vilken build som är röd, om en branch är redo för en PR och om något redan är mergat och väntar på test. All den informationen fanns redan, men den var fragmenterad. Dashboarden samlar den på ett ställe och gör om den till en kort lista över saker som kräver åtgärd.

![Utvecklardashboard med Jira-uppgifter, kopplade pull requests och åtgärdsprioriteringar på en sida.](/images/projects/developer-task-overview-dashboard/overview-dashboard.png)

## Vad dashboarden lyfter fram först

Toppen av sidan är utformad för att snabbt besvara en fråga: vad ska jag ta tag i nu?

I stället för att bara lista tickets och PR:er lyfter den fram det arbete som faktiskt är blockerat eller väntar. Det gäller merge conflicts, felande checks, requested changes, uppgifter som är redo för test och branches som finns men fortfarande saknar en pull request.

![Åtgärdssammanfattning som visar merge conflicts, requested changes, felande checks, testöverlämning och branches redo för PR.](/images/projects/developer-task-overview-dashboard/overview-action-items.png)

## Varför detaljerna spelar roll

Varje uppgiftskort kombinerar Jira-ärendet med GitHub-statusen runt omkring det. Det betyder att jag kan se review-status, mängden kommentarer, senaste aktivitet, felande pipeline-steg och branch readiness utan att hoppa mellan verktyg för att manuellt bygga ihop sammanhanget.

![Detaljerat uppgiftskort som visar en pull request med fel, check-status och nylig review-aktivitet kopplad till Jira-uppgiften.](/images/projects/developer-task-overview-dashboard/overview-task-card.png)

## Varför jag byggde den

Jag ville ha en skärm som minskar context switching och gör uppföljningsarbete tydligt. Det är ett utvecklarverktyg, men värdet är enkelt: mindre overhead, färre missade överlämningar och en snabbare väg från "något behöver uppmärksamhet" till "jag vet exakt vad jag ska göra nu."
