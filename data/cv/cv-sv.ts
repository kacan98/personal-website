import { CVSettings } from '@/types';

export const cvSv: CVSettings = {
  on: true,
  name: "Karel Čančara",
  subtitle: "Full Stack Utvecklare | TypeScript, Angular, React, .NET",
  profilePicture: "/images/cv/profile.jpg",
  mainColumn: [
    {
      id: "profile",
      paragraphs: [{ text: "Full Stack Utvecklare med 4+ års erfarenhet av att bygga webbapplikationer och företagslösningar. Levererat högimpaktfunktioner och betydande prestandaförbättringar.\n\n" },
      { text: "Övergick till utveckling från marknadsföring, vilket ger ett användarfokuserat perspektiv och tvärfunktionella samarbetsförmågor. Konsekvent presterat som toppbidragsgivare i utvecklingsteam med expertis i TypeScript, Angular, React och .NET." }]
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
          paragraphs: [{ text: "- Utvecklar full-stack lösningar för Microsoft Dynamics 365 Finance and Operations för företagskunder" },
      { text: "- Bygger backend-tjänster och API:er med .NET, X++ och C# samtidigt som jag samarbetar med frontend-team" },
      { text: "- Uppnådde 10x prestandaförbättring genom att reducera synkroniseringstid från 20+ minuter till under 2 minuter" }]
        },
        {
          title: "Frontend Webbutvecklare",
          subtitles: {
            left: "Dynaway",
            right: "Jul 2022 - Nov 2024"
          },
          paragraphs: [{ text: "- Byggde TypeScript och Angular webbapplikationer som betjänar 100+ företag" },
      { text: "- Konsekvent rankad som topprestanda i utvecklingsteamsprints" },
      { text: "- Fungerade som Scrum Master för 5-personers utvecklingsteam" },
      { text: "- Förbättrade CI/CD pipelines och automatiserade distributionsarbetsflöden" }]
        },
        {
          title: "Webbutvecklare inom Marknadsföring",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2020 - Jul 2022"
          },
          paragraphs: [{ text: "- Utökade företagets webbplats med anpassade moduler och omskrev förstasidan för att bättre kommunicera värdeproposition" },
      { text: "- Samarbetade med team över avdelningar för att förstå affärsbehov och översätta dem till webblösningar" },
      { text: "- Designade kundinföringsguider och automatiserade e-postarbetsflöden i HubSpot för att förbättra leadgenerering" },
      { text: "- Etablerade videokultur för företaget och skapade produktdemonstrationsinnehåll som stödde försäljning och marknadsföring" }]
        },
        {
          title: "Medgrundare",
          subtitles: {
            left: "AnkeriMedia",
            right: "Nov 2019 - Jul 2020"
          },
          paragraphs: [{ text: "- Medgrundade marknadsföringstjänster startup inriktat på tjeckiska fastighetsbyråer" },
      { text: "- Byggde företagets webbplats, skapade marknadsföringsmaterial och genomförde direkt uppsökning till potentiella kunder" },
      { text: "- Säkrade framgångsrikt 50+ möten med beslutsfattare och stängde 5 betalande kunder" }]
        }
      ]
    },
    {
      id: "education",
      title: "Utbildning",
      subSections: [
        {
          title: "Professionell kandidatexamen i Marknadsföring och Försäljning",
          subtitles: {
            left: "UCN",
            right: ""
          }
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
          iconName: "science",
          text: "AI-Driven Jobbansökningsplattform - Minskade ansökningstid med 80%",
          url: "https://kcancara.vercel.app/project-stories/ai-job-application-platform"
        },
        {
          iconName: "science",
          text: "10x Prestandaförbättring - Minskade synkroniseringstid från 20+ min till <2 min",
          url: "https://kcancara.vercel.app/project-stories/10x-performance-improvement"
        },
        {
          iconName: "gitHub",
          text: "Git-till-Jira Bro - Sparade ~1 timme/månad per utvecklare i tidsspårning",
          url: "https://kcancara.vercel.app/project-stories/git-jira-bridge"
        },
        {
          iconName: "science",
          text: "LinkedIn Jobbfiltrering - Automatiserad jobbskrapning med Playwright",
          url: "https://kcancara.vercel.app/project-stories/playwright-job-scraper"
        },
        {
          iconName: "translate",
          text: "Magic Bookmarks - Byggde universellt miljönavigeringsverktyg",
          url: "https://kcancara.vercel.app/project-stories/magic-bookmarks"
        }
      ]
    }
  ]
};