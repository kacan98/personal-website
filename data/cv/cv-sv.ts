// Data is loose/partial - Zod will parse and fill in required fields with defaults
import { getMailtoHref, getSiteHost, settings } from "@/data/settings";

export const cvSv = {
  on: true,
  name: "Karel Čančara",
  subtitle: "Full Stack Utvecklare | TypeScript, Angular, React, D365 SCM, .NET",
  profilePicture: "/images/cv/profile.jpg",
  mainColumn: [
    {
      id: "profile",
      paragraphs: [
        { text: "Full Stack Utvecklare med 4+ års erfarenhet av att bygga företagsprogramvara, interna verktyg och workflow-förbättringar." },
        { text: "Jag arbetar över både frontend och backend, från gränssnitt och API:er till integrationer och prestandaarbete. Starkast i TypeScript, Angular, React, X++ och .NET-baserade miljöer." }
      ]
    },
    {
      id: "work-experience",
      title: "Arbetslivserfarenhet",
      subSections: [
        {
          id: "dynaway-full-stack-developer",
          title: "Full Stack Utvecklare",
          subtitles: {
            left: "Dynaway",
            right: "Jul 2025 - Nuvarande"
          },
          paragraphs: [
            { text: "- Bygger frontend- och backendfunktioner i Microsoft Dynamics 365 Supply Chain Management, inklusive gränssnitt, endpoints, integrationer och workflow-förbättringar" },
            { text: "- Arbetar i TypeScript, X++ och .NET-baserade miljöer för att stödja verkliga operativa processer" },
            { text: "- Byggde interna utvecklarverktyg, inklusive en Jira/GitHub-dashboard som samlar uppgifter, PR:er, felande pipelines, merge conflicts och kommentarer på ett ställe" },
            { text: "- Förbättrade kritisk dataöverföring med cirka 10x i produktionssystem" }
          ]
        },
        {
          id: "dynaway-d365-scm-xpp-developer",
          title: "D365 SCM X++-utvecklare",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2024 - Jul 2025"
          },
          paragraphs: [
            { text: "- Utvecklade backendlogik och ERP-anpassningar i Microsoft Dynamics 365 Supply Chain Management med X++ och relaterade plattformsverktyg" },
            { text: "- Byggde endpoints och affärslogik som stödde frontend-workflows och enterprisekrav" }
          ]
        },
        {
          title: "Frontend Webbutvecklare",
          subtitles: {
            left: "Dynaway",
            right: "Jul 2022 - Nov 2024"
          },
          paragraphs: [
            { text: "- Byggde TypeScript- och Angular-webbapplikationer som används av 100+ företag" },
            { text: "- Förbättrade CI/CD-workflows och leveranstempo i teamet" },
            { text: "- Arbetade som Scrum Master i ett 5-personers utvecklingsteam" }
          ]
        },
        {
          title: "Webbutvecklare inom Marknadsföring",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2020 - Jul 2022"
          },
          paragraphs: [
            { text: "- Byggde CMS-integrerade moduler och förbättrade värdepresentation på företagets webbplats" },
            { text: "- Samarbetade med team över hela företaget för att översätta produktfunktioner till effektiva webblösningar" },
            { text: "- Designade onboarding-innehåll och automatiserade e-postflöden i HubSpot" }
          ]
        },
        {
          title: "Medgrundare",
          subtitles: {
            left: "AnkeriMedia",
            right: "Nov 2019 - Jul 2020"
          },
          paragraphs: [
            { text: "- Medgrundade en marknadsföringsbyrå med fokus på tjeckiska fastighetsbyråer" },
            { text: "- Byggde företagets webbplats, skapade material och hanterade uppsökande försäljning" },
            { text: "- Säkrade 50+ möten med beslutsfattare och stängde 5 betalande kunder" }
          ]
        }
      ]
    }
  ],
  sideColumn: [
    {
      id: "contact",
      title: "Kontakt",
      bulletPoints: [
        {
          iconName: "translate",
          text: getSiteHost(),
          url: settings.siteUrl
        },
        {
          iconName: "linkedIn",
          text: settings.linkedinUrl.replace(/^https?:\/\/(www\.)?/, ""),
          url: settings.linkedinUrl
        },
        {
          iconName: "gitHub",
          text: settings.githubUrl.replace(/^https?:\/\/(www\.)?/, ""),
          url: settings.githubUrl
        },
        {
          iconName: "mail",
          text: settings.contactEmail || "",
          url: getMailtoHref()
        }
      ]
    },
    {
      id: "skills",
      title: "Färdigheter",
      bulletPoints: [
        {
          iconName: "translate",
          text: "Språk: TypeScript, JavaScript, X++, C#"
        },
        {
          iconName: "translate",
          text: "Ramverk: Angular, React, .NET, Node.js, Express"
        },
        {
          iconName: "gitHub",
          text: "Verktyg: Git, GitHub, BitBucket, Jira, Confluence"
        },
        {
          iconName: "science",
          text: "Testning: Unit testing i Jasmine, Karma"
        },
        {
          iconName: "gitHub",
          text: "CI/CD: GitHub Workflows/Actions"
        }
      ]
    },
    {
      id: "languages",
      title: "Språk",
      bulletPoints: [
        {
          iconName: "translate",
          text: "Tjeckiska (modersmål)"
        },
        {
          iconName: "translate",
          text: "Engelska (flytande)"
        },
        {
          iconName: "translate",
          text: "Danska (flytande)"
        },
        {
          iconName: "translate",
          text: "Svenska (flytande)"
        }
      ]
    },
    {
      id: "personal-projects",
      title: "Personliga Projekt",
      bulletPoints: [
        {
          iconName: "speed",
          text: "10x Prestandaförbättring - Minskade synkroniseringstid från 20+ min till <2 min",
          url: "/sv/projects/10x-performance-improvement"
        },
        {
          iconName: "schedule",
          text: "Git-till-Jira Bro - Sparar ~1 timme/månad per utvecklare i tidsspårning",
          url: "/sv/projects/git-to-jira-bridge"
        },
        {
          iconName: "dashboard",
          text: "Utvecklardashboard - Samlar Jira och GitHub i en vy för aktiva uppgifter, PR:er och uppföljning",
          url: "/sv/projects/git-to-jira-bridge"
        },
        {
          iconName: "psychology",
          text: "AI-driven jobbansökningsplattform - GPT-baserad CV-anpassning och cover letters",
          url: "/sv/projects/ai-job-application-platform"
        }
      ]
    }
  ]
};
