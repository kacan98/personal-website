---
title: "AI Agent til Entreprenörshantering i D365 F&O"
slug: "ai-contractor-management"
description: "AI-driven e-postintegration som låter entreprenörer interagera med D365 Finance & Operations med naturligt språk, med strikt behörighetskontroll och transparenta revisionsspår."
image: "/images/projects/ai-contractor-management.jpg"
imageAlt: "AI Entreprenörshanteringssystem som visar e-postflöde och agentbehandling"
tech: ["AI", "AI Agents", "D365 F&O", "Enterprise Systems"]
featured: true
listed: true
order: 2
date: 2026-06-17
---

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="100%" height="450" src="https://embed.figma.com/board/ZGq40iH5ncosiXILccQRhQ/Dynaway-Contractor-Management-AI-Agent?embed-host=share" allowfullscreen></iframe>

## Problemet

Entreprenörer utför underhållsarbete på industriell utrustning. När de är klara med ett jobb måste någon uppdatera arbetsordern i D365. Innan detta innebar det telefonsamtal, manuell datainmatning eller att vänta på att entreprenörer fyller i formulär. Irriterande för entreprenören, tidskrävande för kontoret, och långsamma uppdateringar för alla som följer arbetet.

## Lösningen

När en entreprenör tilldelas en arbetsorder får de ett e-postmeddelande med alla detaljer - vad som behöver göras, var utrustningen finns, relevanta inköpsorder. De svarar när de är klara:

*"Bytte pumptätningen på linje 2, allt bra."*

En AI-agent läser det, uppdaterar arbetsorderns status i D365, lägger till deras meddelande i jobbanteckningarna och skickar tillbaka en bekräftelse. Det hela tar 15 sekunder istället för telefontagg och datainmatning.

## Hur Det Fungerar

Agenten har exakt tre möjligheter:

1. Uppdatera arbetsorder livscykeltillstånd (endast till tillåtna tillstånd som "Pågående" eller "Slutförd")
2. Lägg till entreprenörskommentarer till specifika jobbrader
3. Spara och bifoga filer från e-post (foton, PDF:er, vad de skickar)

Det är det. Kan inte radera något, kan inte röra prissättning, kan inte se andra arbetsordrar. Om e-postmeddelandet är tvetydigt eller begär något utanför dessa tre åtgärder flaggas det för mänsklig granskning.

Varje konversation loggas - tur för tur, varje beslut AI:n fattar, varje åtgärd den vidtar. Om ett e-postmeddelande misslyckas med bearbetning kan du bearbeta det igen och se både det ursprungliga försöket och det nya. Fullständigt revisionsspår för efterlevnad.

## Vad Jag Lärde Mig Om AI i Produktion

Att bygga detta lärde mig vad som faktiskt spelar roll när man sätter AI i företagssystem:

**Transparens är inte förhandlingsbart.** Varje steg agenten tar loggas - vad den läste, vad den beslutade, vilken åtgärd den vidtog. När något går fel (och det kommer det), måste du se exakt vad AI:n tänkte. Vi byggde en konversationsvisare som visar tur-för-tur-resonemang så kunder kan granska vilket beslut som helst.

**Börja med noll behörigheter.** Ge inte agenten tillgång till allt och hoppas att den beter sig. Börja med ingenting och lägg endast till specifika möjligheter en i taget. Denna agent kan inte ens läsa de flesta arbetsorderfält - bara vad den behöver för att förstå kontext och vidta de tre tillåtna åtgärderna.

**Kunder behöver kontroll.** Vi låter kunder konfigurera vilka livscykeltillstånd entreprenörer kan begära. Vissa vill att entreprenörer ska markera arbete "Slutfört", andra vill inte. AI:n respekterar dessa regler eftersom de är inbakade i behörighetssystemet, inte bara prompt engineering.

**Utveckla det med kunder, inte för dem.** Vi byggde inte detta isolerat och skickade det. Började med en prototyp, visade den för kunder, lyssnade på deras oro för vad som kunde gå fel och byggde skyddsåtgärder för de scenarierna. Granskningskön finns eftersom kunder sa "tänk om AI:n missförstår?" Bra fråga. Nu flaggas tvetydiga e-postmeddelanden för mänsklig granskning.

Resultatet är något som folk faktiskt litar på i produktion. Inte för att AI:n är perfekt, utan för att systemet runt den hanterar de imperfekta delarna säkert.
