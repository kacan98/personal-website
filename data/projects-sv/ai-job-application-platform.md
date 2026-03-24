---
title: "Ett dolt AI-arbetsflöde för CV-anpassning inne i min portfolio"
description: "En lösenordsskyddad CV-editor med AI-anpassning, diffgranskning, översättning och ett arbetsflöde från webbläsare till ansökan."
image: "/images/project-stories/ai-job-application-platform/cv-ai-diff-view.png"
imageAlt: "AI-diffvy som visar anpassade CV-ändringar markerade direkt i det redigerbara CV:t"
featured: true
listed: true
order: 4
category: fullstack
tags:
  - Full-Stack
  - AI
  - Frontend
  - Chrome Extension
metrics:
  impact:
    en: Turns a public CV into a private, reviewable workflow for tailoring applications faster
    da: Gør et offentligt CV til et privat, gennemskueligt workflow til hurtigere målretning af ansøgninger
    sv: Gör ett offentligt CV till ett privat, granskbart arbetsflöde för snabbare CV-anpassning
  timeframe: Built from a local-only tool into a production-ready workflow
liveUrl: /en/cv
sourceUrl: https://github.com/openclaw/personal-website-3
---
# Ett privat arbetsflöde bakom ett offentligt CV

Den här delen av sajten är inte tänkt för vanliga besökare.

Det offentliga CV:t ska förbli lugnt, läsbart och lätt att skanna för rekryterare eller kunder. Redigeringsverktygen är bara viktiga för mig när jag anpassar en ansökan, så jag höll dem medvetet dolda. Innan det här fanns i sajten använde jag samma arbetsflöde lokalt på min egen dator. Det fungerade, men det var irriterande: för många context switches, för mycket copy-paste och ingen gemensam plats där det polerade offentliga CV:t och det privata redigeringsarbetsflödet kunde leva tillsammans.

Så jag slog ihop dem till en sida. Den offentliga versionen förblir ren. Arbetsverktygen finns där när jag behöver dem.

## Steg 1: sidan ser normal ut tills jag behöver verkstaden

För en vanlig besökare är CV:t bara ett CV. Det är avsiktligt.

![Offentlig CV-vy utan synliga redigeringskontroller.](/images/project-stories/ai-job-application-platform/cv-public.png)

Den dolda delen är nästan ett litet skämt: ett klick på sidrubriken öppnar lösenordsdialogen. Jag gillar det eftersom det håller redigeringsflödet tillgängligt utan att göra hela sajten till ett admin-dashboard.

![Lösenordsskyddad ingång till det privata CV-arbetsflödet.](/images/project-stories/ai-job-application-platform/cv-auth-modal.png)

## Steg 2: samma sida blir ett arbetsrum för redigering

Efter inloggning blir sidan en arbetseditor i stället för ett statiskt dokument. Jag kan fortfarande se det slutliga CV:t exakt som en rekryterare skulle läsa det, men nu får jag verktygen som behövs för att anpassa det direkt på sidan.

![Redigerbart CV-läge med den kompakta åtgärdslisten synlig till höger.](/images/project-stories/ai-job-application-platform/cv-edit-mode.png)

Det här är det viktigaste produktbeslutet i flödet: håll dig nära slutresultatet. Jag vill inte ha ett separat adminverktyg med separat förhandsvisning och ytterligare ett exportsteg om jag kan undvika det.

## Steg 3: börja i webbläsaren, inte i en tom textruta

En ingång är Chrome-tillägget. Målet är enkelt: när jag hittar en relevant jobbannons ska jag snabbt kunna flytta den in i CV-flödet i stället för att manuellt bygga upp kontexten varje gång.

![Chrome extension-flöde för att föra in en jobbannons i CV-anpassningsprocessen.](/images/project-stories/ai-job-application-platform/cv-extension-modal.png)

Det låter litet, men det tar bort mycket friktion. Det bästa arbetsflödet är ofta det som minskar antalet flikar och beslut.

## Steg 4: klistra in jobbannonsen och låt CV:t anpassa sig

Om jag redan har rollbeskrivningen kan jag klistra in den direkt i anpassningsflödet. Gränssnittet är medvetet enkelt eftersom det viktiga är briefen, inte en lång lista med inställningar.

![Modal för att anpassa CV:t till en inklistrad jobbannons.](/images/project-stories/ai-job-application-platform/cv-manual-adjustment.png)

Det är här det lokala verktyget blev värt att produktisera. Jag gjorde redan samma sak manuellt om och om igen. Att flytta in det i sajten gjorde processen snabbare, mer konsekvent och lättare att granska.

## Steg 5: AI får gärna hjälpa, men varje ändring ska gå att granska

Den viktigaste delen är inte att generera ändringar. Det är att granska dem. Efter att CV:t har justerats kan jag inspektera exakt vad som ändrades direkt på sidan i stället för att lita på en osynlig omskrivning.

![Diffvy som visar exakt hur AI anpassade CV:t till en roll.](/images/project-stories/ai-job-application-platform/cv-ai-diff-view.png)

Det här är delen jag skulle vilja att en rekryterare eller kund lägger märke till. AI:n är användbar, men den behandlas inte som magi. Arbetsflödet håller resultatet transparent, redigerbart och lätt att validera innan jag använder det.

## Steg 6: översättning stannar i samma flöde

Om jag vill skapa en version på ett annat språk kan jag göra det utan att lämna samma arbetsyta. Det spelar roll eftersom översättning är en verklig del av ansökningsprocessen, inte något som kommer i efterhand.

![Översättningsmodal byggd direkt in i CV-arbetsflödet.](/images/project-stories/ai-job-application-platform/cv-translation-modal.png)

När översättningen finns på samma plats förblir arbetsflödet sammanhängande från start till mål: fånga rollen, anpassa CV:t, granska diffen och förbered rätt version för mottagaren.

## Varför jag tycker att det är värt att visa

Det här är inte hela webbplatsen. Det är en väldigt specifik produktidé gömd inuti den: en privat ansökningsverkstad byggd ovanpå ett offentligt CV.

Jag tycker att det speglar vilken typ av utvecklare jag är på ett användbart sätt. Jag gillar verktyg som löser ett verkligt återkommande problem, jag gillar att hålla avancerade funktioner ur vägen tills de behövs, och jag gillar AI-funktioner bäst när de är praktiska, granskningsbara och förankrade i ett riktigt arbetsflöde.
