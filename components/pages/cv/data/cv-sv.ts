import { CVSettings } from '@/types';

export const cvSv: CVSettings = {
  on: true,
  name: "Karel Čančara",
  subtitle: "Full Stack Utvecklare",
  profilePicture: "/images/cv/profile.jpg",
  mainColumn: [
    {
      title: "Profil",
      paragraphs: [
        "Detaljorienterad och användarfokuserad full stack utvecklare med stark frontend-grund och växande backend-erfarenhet. Skicklig i TypeScript, Angular, React, Node.js och C# med praktisk erfarenhet av Microsoft Dynamics (X++/C#). Känd för en proaktiv inställning, starka kommunikationsfärdigheter och en solid track record av att leverera funktioner i komplexa företagssystem.\n\n",
        "Jag övergick till utveckling från en marknadsföringsbakgrund, vilket ger mig en unik förmåga att tänka från användarens perspektiv, bidra till produktriktning och samarbeta mellan avdelningar. Jag lär mig snabbt, tar ägarskap och levererar konsekvent — toppar ofta story points i team sprints trots att jag är självlärd.",
        "Nu söker jag att växa i en hybrid eller on-site full stack roll runt Köpenhamn, helst i en modern tech stack med backend exponering för C#/.NET eller Node.js."
      ]
    },
    {
      title: "Arbetslivserfarenhet",
      subSections: [
        {
          title: "Full Stack Utvecklare – Dynamics 365 SCM",
          subtitles: {
            left: "Dynaway",
            right: "2024 - nu"
          },
          paragraphs: [
            "- Utvecklade backend-tjänster och API:er i X++, C# och .NET för företags-ERP-programvara. Integrerade med Microsoft Graph.",
            "- Samarbetade med frontend- och infrastrukturteam för att leverera end-to-end-lösningar\n",
            "- Fokuserade på prestandaförbättringar, debugging och kundspecifika funktioner",
            "10x ökade hastigheten för dataöverföring mellan frontend och backend"
          ]
        },
        {
          title: "Frontend Webbutvecklare",
          subtitles: {
            left: "Dynaway",
            right: "2020 - 2024"
          },
          paragraphs: [
            "- Levererade nya funktioner och buggfixar i en Angular/Deno-webbapplikation som används av tekniker\n",
            "- Bidrog med högst antal story points i många sprints",
            "- Förespråkade användarvänlighet och designenkelhet i funktionsdiskussioner\n",
            "- Ledde dagliga och veckovisa Scrum-möten för ett 5-personers utvecklingsteam som Scrum Master."
          ]
        },
        {
          title: "Webb- och Affärsutveckling",
          subtitles: {
            left: "Ankeri Media",
            right: "2019-2020"
          },
          paragraphs: [
            "- Skapade företagets webbplats och ledde varumärkes- och uppsökningskampanjer",
            "- Bokade 50+ möten och säkrade nya kunder via kall uppsökning",
            "- Balanserade marknadsförings- och tekniska ansvarsområden i en startup-miljö"
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
      title: "Projekt",
      subtitles: {
        left: "...som jag har arbetat med på fritiden (bland andra)"
      },
      bulletPoints: [
        {
          iconName: "gitHub",
          text: "Köp vs Hyra Kalkylator (React, MUI, Redux)",
          url: "https://kacan98.github.io/buying-vs-renting/"
        },
        {
          iconName: "gitHub",
          text: "Portfolio (Next.js/React + Markdown)",
          url: "https://github.com/kacan98/my-porfolio"
        },
        {
          iconName: "gitHub",
          text: "Recensionsapp (Angular +.NET + SQL)",
          url: "https://github.com/kacan98/r8tit"
        },
        {
          iconName: "gitHub",
          text: "Gemensam Födelsedag Kalkylator (Angular + Ionic)",
          url: "https://kacan98.github.io/common-age-calculator/"
        }
      ]
    }
  ]
};