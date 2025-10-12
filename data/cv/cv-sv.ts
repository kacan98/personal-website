import { CVSettings } from '@/types';

export const cvSv: CVSettings = {
  on: true,
  name: "Karel Čančara",
  subtitle: "Full Stack Utvecklare | TypeScript, Angular, React, .NET",
  profilePicture: "/images/cv/profile.jpg",
  mainColumn: [
    {
      id: "profile",
      title: "Profil",
      paragraphs: [
        "Full Stack Utvecklare med 4+ års erfarenhet av att bygga webbapplikationer och företagslösningar. Bevisad track record av att leverera högimpaktfunktioner och betydande prestandaförbättringar.\n\n",
        "Övergick till utveckling från marknadsföring, vilket ger ett unikt användarfokuserat perspektiv och tvärfunktionella samarbetsförmågor. Snabb inlärning och konsekvent leverans — ofta högst story points i teamsprints trots självlärd bakgrund."
      ]
    },
    {
      id: "work-experience",
      title: "Arbetslivserfarenhet",
      subSections: [
        {
          title: "Microsoft Dynamics 365 Finance and Operations Developer",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2024 - Nuvarande"
          },
          paragraphs: [
            "- Utvecklar backend-tjänster och API:er i X++, C# och .NET för företags-ERP-programvara. Integrerar med Microsoft Graph.",
            "- Samarbetar med frontend- och infrastrukturteam för att leverera end-to-end-lösningar",
            "- Fokuserar på prestandaförbättringar, debugging och kundspecifika funktioner",
            "- Uppnådde 10x prestandaförbättring i dataöverföring mellan frontend och backend"
          ]
        },
        {
          title: "Frontend Webbutvecklare",
          subtitles: {
            left: "Dynaway",
            right: "Jul 2022 - Nov 2024"
          },
          paragraphs: [
            "- Byggde TypeScript och Angular webbapplikationer som betjänar 200+ företag",
            "- Bidrog med högst antal story points i många sprints",
            "- Förespråkade användarvänlighet och designenkelhet i funktionsdiskussioner\n",
            "- Ledde dagliga och veckovisa Scrum-möten för ett 5-personers utvecklingsteam som Scrum Master."
          ]
        },
        {
          title: "Webbutvecklare inom Marknadsföring",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2020 - Jul 2022"
          },
          paragraphs: [
            "- Utökade företagets webbplats med anpassade moduler och omskrev förstasidan för att bättre kommunicera värdeproposition",
            "- Samarbetade med team över avdelningar för att förstå affärsbehov och översätta dem till webblösningar",
            "- Designade kundinföringsguider och automatiserade e-postarbetsflöden i HubSpot för att förbättra leadgenerering",
            "- Etablerade videokultur för företaget och skapade produktdemonstrationsinnehåll som stödde försäljning och marknadsföring"
          ]
        },
        {
          title: "Medgrundare",
          subtitles: {
            left: "AnkeriMedia",
            right: "Nov 2019 - Jul 2020"
          },
          paragraphs: [
            "- Medgrundade marknadsföringstjänster startup inriktat på tjeckiska fastighetsbyråer",
            "- Byggde företagets webbplats, skapade marknadsföringsmaterial och genomförde direkt uppsökning till potentiella kunder",
            "- Säkrade framgångsrikt 50+ möten med beslutsfattare och stängde 5 betalande kunder"
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
          text: "kcancara.vercel.app/",
          url: "https://kcancara.vercel.app/"
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
          text: "karel.cancara@gmail.com",
          url: "mailto:karel.cancara@gmail.com"
        }
      ]
    },
    {
      id: "skills",
      title: "Färdigheter",
      bulletPoints: [
        {
          iconName: "translate",
          text: "Språk: TypeScript, JavaScript, C#"
        },
        {
          iconName: "translate",
          text: "Ramverk: Angular, React, .NET, Node.js, Express, Deno"
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
          iconName: "science",
          text: "AI-Driven Jobbansökningsplattform - Minskade ansökningstid med 80%",
          url: "https://kcancara.vercel.app/case-studies/ai-job-application-platform"
        },
        {
          iconName: "science",
          text: "10x Prestandaförbättring - Minskade förfrågningstid från 30s till 3s",
          url: "https://kcancara.vercel.app/case-studies/10x-performance-improvement"
        },
        {
          iconName: "gitHub",
          text: "Git-till-Jira Bro - Automatiserade 10+ timmar/månad tidsspårning",
          url: "https://kcancara.vercel.app/case-studies/git-jira-bridge"
        },
        {
          iconName: "science",
          text: "LinkedIn Jobbfiltrering - Automatiserad jobbskrapning med Playwright",
          url: "https://kcancara.vercel.app/case-studies/playwright-job-scraper"
        },
        {
          iconName: "translate",
          text: "Magic Bookmarks - Universellt miljönavigeringsverktyg",
          url: "https://kcancara.vercel.app/case-studies/magic-bookmarks"
        }
      ]
    }
  ]
};