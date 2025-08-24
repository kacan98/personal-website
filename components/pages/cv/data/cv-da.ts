import { CVSettings } from '@/types';

export const cvConfigDa: CVSettings = {
  on: true,
  name: "Karel Čančara",
  subtitle: "Full Stack Udvikler",
  profilePicture: "/images/cv/profile.jpg",
  mainColumn: [
    {
      title: "Profil",
      paragraphs: [
        "Detaljeorienteret og brugerfokuseret full stack udvikler med et stærkt frontend-fundament og voksende backend-erfaring. Dygtig i TypeScript, Angular, React, Node.js og C# med praktisk erfaring i Microsoft Dynamics (X++/C#). Kendt for en proaktiv tilgang, stærke kommunikationsfærdigheder og en solid track record med at levere funktioner i komplekse virksomhedssystemer.\n\n",
        "Jeg er skiftet til udvikling fra en marketingbaggrund, hvilket giver mig en unik evne til at tænke fra brugerens perspektiv, bidrage til produktretning og samarbejde på tværs af afdelinger. Jeg lærer hurtigt, tager ansvar og leverer konsistent — topper ofte story points i team sprints på trods af at være selvlært.",
        "Nu søger jeg at vokse i en hybrid eller on-site full stack rolle omkring København, ideelt set i en moderne tech stack med backend eksponering til C#/.NET eller Node.js."
      ]
    },
    {
      title: "Arbejdserfaring",
      subSections: [
        {
          title: "Full Stack Udvikler – Dynamics 365 SCM",
          subtitles: {
            left: "Dynaway",
            right: "2024 - nu"
          },
          paragraphs: [
            "- Udviklede backend-tjenester og API'er i X++, C# og .NET til virksomheds-ERP-software. Integrerede med Microsoft Graph.",
            "- Samarbejdede med frontend- og infrastrukturteams for at levere end-to-end-løsninger\n",
            "- Fokuserede på præstationsforbedringer, debugging og kundespecifikke funktioner",
            "10x forøgede hastigheden af dataoverførsel mellem frontend og backend"
          ]
        },
        {
          title: "Frontend Webudvikler",
          subtitles: {
            left: "Dynaway",
            right: "2020 - 2024"
          },
          paragraphs: [
            "- Leverede nye funktioner og fejlrettelser i en Angular/Deno-webapplikation brugt af teknikere\n",
            "- Bidrog med det højeste antal story points i mange sprints",
            "- Tog til orde for brugervenlighed og designsimplicitet i funktionsdiskussioner\n",
            "- Ledede daglige og ugentlige Scrum-møder for et 5-personers udviklingshold som Scrum Master."
          ]
        },
        {
          title: "Web- og Forretningsudvikling",
          subtitles: {
            left: "Ankeri Media",
            right: "2019-2020"
          },
          paragraphs: [
            "- Skabte virksomhedens hjemmeside og ledede branding- og opsøgningskampagner",
            "- Bookede 50+ møder og sikrede nye kunder via kold opsøgning",
            "- Balancerede marketing- og tekniske ansvar i et startup-miljø"
          ]
        }
      ]
    }
  ],
  sideColumn: [
    {
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
      title: "Sprog",
      bulletPoints: [
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
      title: "Projekter",
      subtitles: {
        left: "...som jeg har arbejdet på i min fritid (blandt andre)"
      },
      bulletPoints: [
        {
          iconName: "gitHub",
          text: "Køb vs Leje Calculator (React, MUI, Redux)",
          url: "https://kacan98.github.io/buying-vs-renting/"
        },
        {
          iconName: "gitHub",
          text: "Portfolio (Next.js/React + Markdown)",
          url: "https://github.com/kacan98/my-porfolio"
        },
        {
          iconName: "gitHub",
          text: "Anmeldelsesapp (Angular +.NET + SQL)",
          url: "https://github.com/kacan98/r8tit"
        },
        {
          iconName: "gitHub",
          text: "Fælles Fødselsdag Calculator (Angular + Ionic)",
          url: "https://kacan98.github.io/common-age-calculator/"
        }
      ]
    }
  ]
};