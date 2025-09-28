import { CVSettings } from '@/types';

export const cvConfigEn: CVSettings = {
  on: true,
  name: "Karel Čančara",
  subtitle: "Full Stack Developer | TypeScript, Angular, React, .NET",
  profilePicture: "/images/cv/profile.jpg",
  mainColumn: [
    {
      id: "profile",
      title: "Profile",
      paragraphs: [
        "Full Stack Developer with 4+ years of experience in building web applications and enterprise solutions. Delivered high-impact features and achieved significant performance improvements.\n\n",
        "Transitioned from marketing to development, bringing a user-focused perspective and cross-functional collaboration skills. Consistently performed as top contributor in development teams with expertise in TypeScript, Angular, React, and .NET."
      ]
    },
    {
      id: "work-experience",
      title: "Work Experience",
      subSections: [
        {
          title: "Microsoft Dynamics 365 Finance and Operations Developer",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2024 - Present"
          },
          paragraphs: [
            "- Developing full-stack solutions for Microsoft Dynamics 365 Finance and Operations serving enterprise clients",
            "- Building backend services and APIs using .NET, X++, and C# while collaborating with frontend teams",
            "- Achieved 10x performance improvement in data transfer between frontend and backend systems"
          ]
        },
        {
          title: "Frontend Web Developer",
          subtitles: {
            left: "Dynaway",
            right: "Jul 2022 - Nov 2024"
          },
          paragraphs: [
            "- Built TypeScript and Angular web applications serving 100+ companies",
            "- Consistently delivered highest story points in team sprints while enhancing CI/CD pipelines",
            "- Served as Scrum Master for 5-person development team"
          ]
        },
        {
          title: "Web Developer in Marketing",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2020 - Jul 2022"
          },
          paragraphs: [
            "- Extended company website with custom modules and rewrote front page for better value communication",
            "- Collaborated across departments to translate business needs into web solutions",
            "- Designed customer onboarding guides and automated email workflows in HubSpot",
            "- Created product demonstration videos supporting sales and marketing efforts"
          ]
        },
        {
          title: "Co-Founder",
          subtitles: {
            left: "AnkeriMedia",
            right: "Nov 2019 - Jul 2020"
          },
          paragraphs: [
            "- Co-founded marketing services startup targeting Czech real estate agencies",
            "- Built company website, created marketing materials, and conducted direct outreach to potential clients",
            "- Successfully secured 50+ meetings with decision-makers and closed 5 paying customers"
          ]
        }
      ]
    }
  ],
  sideColumn: [
    {
      id: "contact",
      title: "Contact",
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
      title: "Skills",
      bulletPoints: [
        {
          iconName: "translate",
          text: "Languages: TypeScript, JavaScript, C#"
        },
        {
          iconName: "translate",
          text: "Frameworks: Angular, React, .NET, Node.js, Express, Deno"
        },
        {
          iconName: "gitHub",
          text: "Tools: Git, GitHub, BitBucket, Jira, Confluence"
        },
        {
          iconName: "science",
          text: "Testing: Unit testing in Jasmine, Karma"
        },
        {
          iconName: "gitHub",
          text: "CI/CD: GitHub Workflows/Actions"
        }
      ]
    },
    {
      id: "languages",
      title: "Languages",
      bulletPoints: [
        {
          iconName: "translate",
          text: "English (fluent)"
        },
        {
          iconName: "translate",
          text: "Danish (fluent)"
        },
        {
          iconName: "translate",
          text: "Swedish (fluent)"
        }
      ]
    },
    {
      id: "personal-projects",
      title: "Personal Projects",
      bulletPoints: [] // Will be populated dynamically from Project Stories
    }
  ]
};