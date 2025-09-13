---
title: "Git-to-JIRA Bridge"
description: "Full-stack tidsspårningssystem som automatiskt synkroniserar utvecklingstimmar från Git commits till JIRA worklogs, vilket eliminerar manuell tidsrapportering."
image: "/images/projects/git-to-jira-bridge.png"
imageAlt: "Git-to-JIRA Bridge dashboard som visar tidsspårning interface"
tech: ["TypeScript", "React", "Node.js", "Express", "Git API", "JIRA API", "Vercel", "CSV Processing"]
links:
  - title: "Deployment"
    url: "https://log-bridge.vercel.app"
    iconName: "externalLink"
  - title: "Repo"
    url: "https://github.com/kacan98/track-current-task"
    iconName: "gitHub"
featured: true
order: 1
---

## Översikt

Git-to-JIRA Bridge är en omfattande tidsspårningslösning som bygger bro mellan faktiskt utvecklingsarbete och tidsrapporteringskrav. Systemet är byggt för att lösa den tråkiga uppgiften med manuell tidsregistrering och fångar automatiskt utvecklingstimmar från Git-aktivitet och synkroniserar dem smidigt till JIRA worklogs.

## Problemet

Manuell tidsspårning är störande och tidskrävande för utvecklare. Traditionella metoder avbryter utvecklingsflödet och resulterar ofta i felaktiga eller glömda tidsposter, vilket gör JIRA tidsrapportering till en smärtsam administrativ börda.

## Lösningen

En 3-stegs automatiserad workflow:

1. **📊 Datainsamling** - Flera flexibla inputmetoder:
   - Background tracker som övervakar Git repositories i realtid
   - GitHub commits integration för historisk datagenerering
   - CSV uppladdning för befintlig tidsspårningsdata
   - Manuell inmatning med användarvänligt webbgränssnitt

2. **✏️ Smart Redigering** - Intelligent tidsinmatningshantering:
   - Automatisk task ID-extrahering från branch-namn med regex-mönster
   - Auto-ifyllda JIRA task detaljer när ansluten
   - Vecko-/dagsvisningar med dra-och-släpp redigering
   - Massoperationer för återkommande uppgifter

3. **🚀 Ett-klick Synkronisering** - Smidig JIRA integration:
   - Säker autentisering med personliga åtkomsttoken
   - Automatisk worklog skapande med korrekt task-länkning
   - Stöd för både JIRA Cloud och Server instanser

## Teknisk Arkitektur

**Frontend**: React-baserat webbgränssnitt med TypeScript för typsäkerhet och moderna UI-mönster
**Backend**: Express.js API designat för serverless deployment på Vercel
**Background Tracker**: Fristående desktop-applikation för kontinuerlig Git-övervakning
**Dataflöde**: Realtids Git-övervakning → CSV-generering → Webbgränssnitt → JIRA API integration

## Nyckelfunktioner

- **Privacy-First**: All data lagras lokalt i webbläsaren eller CSV-filer, ingen server-side data persistering
- **Flexibel Input**: Flera datakällor tillgodoser olika arbetsflöden
- **Smart Automatisering**: Automatisk task ID extrahering och JIRA task detail population
- **Cross-Platform**: Desktop tracker fungerar på Windows, Mac och Linux
- **Realtidsövervakning**: Detekterar filändringar, commits och branch checkouts
- **Säker Autentisering**: HTTP-only cookies och säker tokenhantering
- **Produktionsklar**: 41 releases med automatiserad CI/CD pipeline

## Affärseffekt

- **95% Tid Sparad**: Eliminerar dagliga manuella tidsinmatningsuppgifter
- **100% Noggrannhet**: Fångar faktisk utvecklingstid vs. estimat
- **Smidig Integration**: Fungerar med befintliga Git och JIRA arbetsflöden
- **Noll Störning**: Bakgrundsövervakning avbryter inte utvecklingsflödet

## Tekniska Höjdpunkter

- **Monorepo Arkitektur**: Organiserade paket för underhållbarhet
- **Type-Safe APIs**: Full TypeScript implementation över hela stacken
- **Serverless-Redo**: Optimerad för Vercel deployment
- **Automatiserade Releases**: CI/CD pipeline med semantisk versionshantering
- **Cross-Platform Desktop**: Electron-baserad background tracker
- **RESTful Design**: Rena API-gränssnitt för utökningsbarhet