// Data is loose/partial - Zod will parse and fill in required fields with defaults
export const cvConfigDa = {
  on: true,
  name: "Karel Čančara",
  subtitle: "Full Stack Udvikler | TypeScript, Angular, React, D365 SCM, .NET",
  profilePicture: "/images/cv/profile.jpg",
  mainColumn: [
    {
      id: "profile",
      paragraphs: [
        { text: "Full Stack Udvikler med 4+ års erfaring i at bygge virksomhedssoftware, interne værktøjer og workflow-forbedringer." },
        { text: "Jeg arbejder på tværs af frontend og backend, fra interfaces og API'er til integrationer og performancearbejde. Stærkest i TypeScript, Angular, React, X++ og .NET-baserede miljøer." }
      ]
    },
    {
      id: "work-experience",
      title: "Arbejdserfaring",
      subSections: [
        {
          id: "dynaway-full-stack-developer",
          title: "Full Stack Udvikler",
          subtitles: {
            left: "Dynaway",
            right: "Jul 2025 - Nu"
          },
          paragraphs: [
            { text: "- Bygger frontend- og backend-funktioner i Microsoft Dynamics 365 Supply Chain Management, herunder interfaces, endpoints, integrationer og workflow-forbedringer" },
            { text: "- Arbejder i TypeScript, X++ og .NET-baserede miljøer for at understøtte reelle driftsprocesser" },
            { text: "- Byggede interne udviklerværktøjer, herunder et Jira/GitHub-dashboard der samler opgaver, PR'er, fejlende pipelines, merge conflicts og kommentarer ét sted" },
            { text: "- Forbedrede kritisk dataoverførsel med cirka 10x i produktionssystemer" }
          ]
        },
        {
          id: "dynaway-d365-scm-xpp-developer",
          title: "D365 SCM X++-udvikler",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2024 - Jul 2025"
          },
          paragraphs: [
            { text: "- Udviklede backend-logik og ERP-tilpasninger i Microsoft Dynamics 365 Supply Chain Management med X++ og relaterede platformsværktøjer" },
            { text: "- Byggede endpoints og forretningslogik, der understøttede frontend-workflows og enterprise-krav" }
          ]
        },
        {
          title: "Frontend Webudvikler",
          subtitles: {
            left: "Dynaway",
            right: "Jul 2022 - Nov 2024"
          },
          paragraphs: [
            { text: "- Byggede TypeScript- og Angular-webapplikationer brugt af 100+ virksomheder" },
            { text: "- Forbedrede CI/CD-workflows og leveringstempo på teamet" },
            { text: "- Fungerede som Scrum Master for et 5-personers udviklingsteam" }
          ]
        },
        {
          title: "Webudvikler i Marketing",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2020 - Jul 2022"
          },
          paragraphs: [
            { text: "- Byggede CMS-integrerede moduler og forbedrede værdipræsentation på tværs af hjemmesiden" },
            { text: "- Arbejdede med teams på tværs af virksomheden for at omsætte produktfunktioner til effektive webløsninger" },
            { text: "- Designede onboarding-indhold og automatiserede e-mail-workflows i HubSpot" }
          ]
        },
        {
          title: "Medstifter",
          subtitles: {
            left: "AnkeriMedia",
            right: "Nov 2019 - Jul 2020"
          },
          paragraphs: [
            { text: "- Medstiftede et marketingbureau med fokus på tjekkiske ejendomsbureauer" },
            { text: "- Byggede virksomhedens hjemmeside, skabte materialer og håndterede opsøgende salg" },
            { text: "- Sikrede 50+ møder med beslutningstagere og lukkede 5 betalende kunder" }
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
          text: "cancara.dk",
          url: "https://cancara.dk/"
        },
        {
          iconName: "linkedIn",
          text: "linkedin.com/in/kcancara",
          url: "https://www.linkedin.com/in/kcancara"
        },
        {
          iconName: "gitHub",
          text: "github.com/kacan98",
          url: "https://github.com/kacan98"
        },
        {
          iconName: "mail",
          text: "karel@cancara.dk",
          url: "mailto:karel@cancara.dk"
        }
      ]
    },
    {
      id: "skills",
      title: "Færdigheder",
      bulletPoints: [
        {
          iconName: "translate",
          text: "Sprog: TypeScript, JavaScript, X++, C#"
        },
        {
          iconName: "translate",
          text: "Frameworks: Angular, React, .NET, Node.js, Express"
        },
        {
          iconName: "gitHub",
          text: "Værktøjer: Git, GitHub, BitBucket, Jira, Confluence"
        },
        {
          iconName: "science",
          text: "Testing: Unit testing i Jasmine, Karma"
        },
        {
          iconName: "gitHub",
          text: "CI/CD: GitHub Workflows/Actions"
        }
      ]
    },
    {
      id: "languages",
      title: "Sprog",
      bulletPoints: [
        {
          iconName: "translate",
          text: "Tjekkisk (modersmål)"
        },
        {
          iconName: "translate",
          text: "Engelsk (flydende)"
        },
        {
          iconName: "translate",
          text: "Dansk (flydende)"
        },
        {
          iconName: "translate",
          text: "Svensk (flydende)"
        }
      ]
    },
    {
      id: "personal-projects",
      title: "Personlige Projekter",
      bulletPoints: [
        {
          iconName: "speed",
          text: "10x Præstationsforbedring - Reducerede synkroniseringstid fra 20+ min til <2 min",
          url: "/da/projects/10x-performance-improvement"
        },
        {
          iconName: "schedule",
          text: "Git-til-Jira Bro - Sparer ~1 time/måned per udvikler i tidssporing",
          url: "/da/projects/git-to-jira-bridge"
        },
        {
          iconName: "dashboard",
          text: "Udviklerdashboard - Samler Jira og GitHub i ét overblik for aktive opgaver, PR'er og opfølgning",
          url: "/da/projects/git-to-jira-bridge"
        },
        {
          iconName: "psychology",
          text: "AI-drevet jobansøgningsplatform - GPT-baseret CV-tilpasning og cover letters",
          url: "/da/projects/ai-job-application-platform"
        }
      ]
    }
  ]
};
