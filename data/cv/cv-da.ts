import { CVSettings } from '@/types';

export const cvConfigDa: CVSettings = {
  on: true,
  name: "Karel Čančara",
  subtitle: "Full Stack Udvikler | TypeScript, Angular, React, .NET",
  profilePicture: "/images/cv/profile.jpg",
  mainColumn: [
    {
      id: "profile",
      title: "Profil",
      paragraphs: [
        "Full Stack Udvikler med 4+ års erfaring med at bygge webapplikationer og virksomhedsløsninger. Leveret funktioner med stor indvirkning og betydelige ydeevneforbedringer.\n\n",
        "Skiftet til udvikling fra marketing, hvilket giver et bruger-fokuseret perspektiv og tværfaglige samarbejdsevner. Konsekvent præsteret som top-bidragyder i udviklingsteams med ekspertise i TypeScript, Angular, React og .NET."
      ]
    },
    {
      id: "work-experience",
      title: "Arbejdserfaring",
      subSections: [
        {
          title: "Microsoft Dynamics 365 Finance and Operations Developer",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2024 - Nu"
          },
          paragraphs: [
            "- Udvikler full-stack løsninger til Microsoft Dynamics 365 Finance and Operations for virksomhedskunder",
            "- Bygger backend-tjenester og API'er ved brug af .NET, X++ og C# mens jeg samarbejder med frontend-teams",
            "- Opnåede 10x ydeevneforbedring ved at reducere synkroniseringstid fra 20+ minutter til under 2 minutter"
          ]
        },
        {
          title: "Frontend Webudvikler",
          subtitles: {
            left: "Dynaway",
            right: "Jul 2022 - Nov 2024"
          },
          paragraphs: [
            "- Byggede TypeScript og Angular webapplikationer der betjener 100+ virksomheder",
            "- Konsekvent rangeret som top-performer i udviklingshold sprints",
            "- Fungerede som Scrum Master for 5-personers udviklingshold",
            "- Forbedrede CI/CD pipelines og automatiserede deployment-workflows"
          ]
        },
        {
          title: "Webudvikler i Marketing",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2020 - Jul 2022"
          },
          paragraphs: [
            "- Udvidede virksomhedens hjemmeside med brugerdefinerede moduler og omskrev forsiden for bedre at kommunikere værdiproposition",
            "- Samarbejdede med teams på tværs af afdelinger for at forstå forretningsbehov og oversætte dem til webløsninger",
            "- Designede kundeintroduktionsguider og automatiserede e-mail-workflows i HubSpot for at forbedre lead generation",
            "- Etablerede videokultur for virksomheden og skabte produktdemonstrationsindhold til støtte for salg og marketing"
          ]
        },
        {
          title: "Medstifter",
          subtitles: {
            left: "AnkeriMedia",
            right: "Nov 2019 - Jul 2020"
          },
          paragraphs: [
            "- Medstiftede marketing-tjenester startup med fokus på tjekkiske ejendomsbureauer",
            "- Byggede virksomhedens hjemmeside, skabte marketingmaterialer og udførte direkte opsøgning til potentielle kunder",
            "- Sikrede succesfuldt 50+ møder med beslutningstagere og lukkede 5 betalende kunder"
          ]
        }
      ]
    },
    {
      id: "education",
      title: "Uddannelse",
      subSections: [
        {
          title: "Professionsbachelor i Marketing og Salg",
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
      title: "Færdigheder",
      bulletPoints: [
        {
          iconName: "translate",
          text: "Sprog: TypeScript, JavaScript, C#"
        },
        {
          iconName: "translate",
          text: "Frameworks: Angular, React, .NET, Node.js, Express, Deno"
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
          iconName: "science",
          text: "AI-Drevet Jobansøgningsplatform - Reducerede ansøgningstid med 80%",
          url: "https://kcancara.vercel.app/project-stories/ai-job-application-platform"
        },
        {
          iconName: "science",
          text: "10x Præstationsforbedring - Reducerede synkroniseringstid fra 20+ min til <2 min",
          url: "https://kcancara.vercel.app/project-stories/10x-performance-improvement"
        },
        {
          iconName: "gitHub",
          text: "Git-til-Jira Bro - Sparer ~1 time/måned per udvikler i tidssporing",
          url: "https://kcancara.vercel.app/project-stories/git-jira-bridge"
        },
        {
          iconName: "science",
          text: "LinkedIn Job-filtrering - Automatiseret jobscraping med Playwright",
          url: "https://kcancara.vercel.app/project-stories/playwright-job-scraper"
        },
        {
          iconName: "translate",
          text: "Magic Bookmarks - Universelt miljønavigeringsværktøj",
          url: "https://kcancara.vercel.app/project-stories/magic-bookmarks"
        }
      ]
    }
  ]
};