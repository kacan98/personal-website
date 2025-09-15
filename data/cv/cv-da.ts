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
        "Full Stack Udvikler med 4+ års erfaring med at bygge webapplikationer og virksomhedsløsninger. Dokumenteret track record med at levere funktioner med stor indvirkning og betydelige ydeevneforbedringer.\n\n",
        "Skiftet til udvikling fra marketing, hvilket giver en unik bruger-fokuseret tilgang og tværfaglige samarbejdsevner. Hurtig læring og konsistent levering — ofte med højest story points i teamsprints trods selvlært baggrund."
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
            right: "Jul 2022 - Nov 2024"
          },
          paragraphs: [
            "- Byggede TypeScript og Angular webapplikationer der betjener 200+ virksomheder",
            "- Bidrog med det højeste antal story points i mange sprints",
            "- Tog til orde for brugervenlighed og designsimplicitet i funktionsdiskussioner\n",
            "- Ledede daglige og ugentlige Scrum-møder for et 5-personers udviklingshold som Scrum Master."
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
          iconName: "gitHub",
          text: "Git-til-JIRA Bridge - Automatiseret tidssporingssystem der synkroniserer Git commits til JIRA (React/Node.js)",
          url: "https://log-bridge.vercel.app"
        },
        {
          iconName: "gitHub",
          text: "Ejendomsinvesteringscalculator - React/Redux finansiel analyseværktøj",
          url: "https://kacan98.github.io/buying-vs-renting/"
        },
        {
          iconName: "gitHub",
          text: "Anmeldelsesapp - Simpel rating app med database lagring (Angular/.NET/Azure)",
          url: "https://github.com/kacan98/r8tit"
        },
        {
          iconName: "gitHub",
          text: "Tjekkiet Rejseguide - Astro-baseret rejseguide",
          url: "https://czech-guide.vercel.app/en/"
        }
      ]
    }
  ]
};