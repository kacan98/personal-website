---
title: "AI Agent til Entreprenørstyring i D365 F&O"
slug: "ai-contractor-management"
description: "AI-drevet email-integration, der lader entreprenører interagere med D365 Finance & Operations ved hjælp af naturligt sprog, med streng rettighedskontrol og gennemsigtige revisionsspor."
image: "/images/projects/ai-contractor-management.jpg"
imageAlt: "AI Entreprenørstyringssystem der viser email-workflow og agentbehandling"
tech: ["AI", "AI Agents", "D365 F&O", "Enterprise Systems"]
featured: true
listed: true
order: 2
date: 2026-06-17
---

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="100%" height="450" src="https://embed.figma.com/board/ZGq40iH5ncosiXILccQRhQ/Dynaway-Contractor-Management-AI-Agent?embed-host=share" allowfullscreen></iframe>

## Problemet

Entreprenører udfører vedligeholdelsesarbejde på industrielt udstyr. Når de afslutter et job, skal nogen opdatere arbejdsordren i D365. Før dette betød det telefonopkald, manuel dataindtastning eller venten på, at entreprenører udfylder formularer. Irriterende for entreprenøren, tidskrævende for kontoret, og langsomme opdateringer for alle der følger arbejdet.

## Løsningen

Når en entreprenør bliver tildelt en arbejdsordre, modtager de en email med alle detaljer - hvad der skal gøres, hvor udstyret befinder sig, relevante indkøbsordrer. De svarer når de er færdige:

*"Udskiftede pumpen pakning på linje 2, alt i orden."*

En AI-agent læser det, opdaterer arbejdsordrens status i D365, tilføjer deres besked til jobnoterne, og sender en bekræftelse tilbage. Det hele tager 15 sekunder i stedet for telefon-tag og dataindtastning.

## Sådan Fungerer Det

Agenten har præcis tre muligheder:

1. Opdater arbejdsordre livscyklustilstande (kun til tilladte tilstande som "I gang" eller "Afsluttet")
2. Tilføj entreprenørbemærkninger til specifikke joblinjer
3. Gem og vedhæft filer fra email (billeder, PDF'er, hvad de sender)

Det er det. Kan ikke slette noget, kan ikke røre priser, kan ikke se andre arbejdsordrer. Hvis emailen er tvetydig eller anmoder om noget uden for disse tre handlinger, bliver den markeret til menneskelig gennemgang.

Hver samtale bliver logget - tur for tur, hver beslutning AI'en træffer, hver handling den tager. Hvis en email fejler under behandling, kan du genbehandle den og se både det oprindelige forsøg og det nye. Komplet revisionsspor til compliance.

## Hvad Jeg Lærte Om AI i Produktion

At bygge dette lærte mig, hvad der faktisk betyder noget, når man putter AI ind i virksomhedssystemer:

**Gennemsigtighed er ikke til forhandling.** Hvert trin agenten tager bliver logget - hvad den læste, hvad den besluttede, hvilken handling den tog. Når noget går galt (og det vil det), skal du se præcis hvad AI'en tænkte. Vi byggede en samtalevisning der viser tur-for-tur ræsonnement, så kunder kan revidere enhver beslutning.

**Start med nul rettigheder.** Giv ikke agenten adgang til alt og håb den opfører sig. Start med ingenting og tilføj kun specifikke muligheder en ad gangen. Denne agent kan ikke engang læse de fleste arbejdsordrefelter - kun hvad den har brug for til at forstå kontekst og udføre de tre tilladte handlinger.

**Kunder har brug for kontrol.** Vi lader kunder konfigurere hvilke livscyklustilstande entreprenører kan anmode om. Nogle vil have entreprenører til at markere arbejde "Afsluttet", andre vil ikke. AI'en respekterer disse regler fordi de er bagt ind i rettighedssystemet, ikke bare prompt engineering.

**Udvikl det med kunder, ikke for dem.** Vi byggede ikke dette isoleret og shippede det. Startede med en prototype, viste den til kunder, lyttede til deres bekymringer om hvad der kunne gå galt, og byggede sikkerhedsforanstaltninger til de scenarier. Gennemgangskøen eksisterer fordi kunder sagde "hvad hvis AI'en misforstår?" Godt spørgsmål. Nu bliver tvetydige emails markeret til menneskelig gennemgang.

Resultatet er noget folk faktisk stoler på i produktion. Ikke fordi AI'en er perfekt, men fordi systemet omkring den håndterer de uperfekte dele sikkert.
