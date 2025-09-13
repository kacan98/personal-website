---
title: "Git-to-JIRA Bridge"
description: "Full-stack tidsregistreringssystem der automatisk synkroniserer udviklingstimer fra Git commits til JIRA worklogs, hvilket eliminerer manuel tidsrapportering."
image: "/images/projects/git-to-jira-bridge.png"
imageAlt: "Git-to-JIRA Bridge dashboard der viser tidsregistrerings interface"
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

## Oversigt

Git-to-JIRA Bridge er en omfattende tidsregistreringsløsning, der bygger bro mellem det faktiske udviklingsarbejde og kravene til tidsrapportering. Systemet er bygget til at løse den kedelige opgave med manuel tidsregistrering og fanger automatisk udviklingstimer fra Git-aktivitet og synkroniserer dem problemfrit til JIRA worklogs.

## Problemet

Manuel tidsregistrering er forstyrrende og tidskrævende for udviklere. Traditionelle metoder afbryder udviklingsflowet og resulterer ofte i unøjagtige eller glemte tidsindtastninger, hvilket gør JIRA tidsrapportering til en smertefuld administrativ byrde.

## Løsningen

En 3-trins automatiseret workflow:

1. **📊 Dataindsamling** - Flere fleksible inputmetoder:
   - Background tracker der overvåger Git repositories i real-time
   - GitHub commits integration til historisk datagenerering
   - CSV upload til eksisterende tidsregistreringsdata
   - Manuel indtastning med brugervenligt web interface

2. **✏️ Smart Redigering** - Intelligent tidsindtastningsstyring:
   - Automatisk task ID-udtrækning fra branch-navne ved hjælp af regex-mønstre
   - Auto-udfyldte JIRA task detaljer når forbundet
   - Ugentlige/daglige visninger med træk-og-slip redigering
   - Masseoperationer for tilbagevendende opgaver

3. **🚀 Et-klik Synkronisering** - Problemfri JIRA integration:
   - Sikker godkendelse med personlige adgangstokens
   - Automatisk worklog oprettelse med korrekt task-linking
   - Support til både JIRA Cloud og Server instanser

## Teknisk Arkitektur

**Frontend**: React-baseret web interface med TypeScript for type sikkerhed og moderne UI mønstre
**Backend**: Express.js API designet til serverless deployment på Vercel
**Background Tracker**: Selvstændig desktop applikation til kontinuerlig Git overvågning
**Dataflow**: Real-time Git overvågning → CSV generering → Web interface → JIRA API integration

## Nøglefunktioner

- **Privacy-First**: Alle data gemmes lokalt i browser eller CSV-filer, ingen server-side data persistering
- **Fleksibel Input**: Flere datakilder imødekommer forskellige workflows
- **Smart Automatisering**: Automatisk task ID udtrækning og JIRA task detail population
- **Cross-Platform**: Desktop tracker virker på Windows, Mac og Linux
- **Real-Time Overvågning**: Detekterer filændringer, commits og branch checkouts
- **Sikker Godkendelse**: HTTP-only cookies og sikker token håndtering
- **Produktionsklar**: 41 udgivelser med automatiseret CI/CD pipeline

## Forretningseffekt

- **95% Tid Sparet**: Eliminerer daglige manuelle tidsindtastningsopgaver
- **100% Nøjagtighed**: Fanger faktisk udviklingstid vs. estimater
- **Problemfri Integration**: Virker med eksisterende Git og JIRA workflows
- **Nul Forstyrelse**: Background overvågning afbryder ikke udviklingsflowet

## Tekniske Højdepunkter

- **Monorepo Arkitektur**: Organiserede pakker for vedligeholdelse
- **Type-Safe APIs**: Fuld TypeScript implementering på tværs af stakken
- **Serverless-Klar**: Optimeret til Vercel deployment
- **Automatiserede Udgivelser**: CI/CD pipeline med semantisk versionering
- **Cross-Platform Desktop**: Electron-baseret background tracker
- **RESTful Design**: Rene API interfaces for udvidelse