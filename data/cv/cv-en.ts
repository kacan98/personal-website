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
        { text: "Full Stack Developer with 4+ years of experience in building web applications and enterprise solutions. Delivered high-impact features and achieved significant performance improvements.\n\n" },
        { text: "Transitioned from marketing to development, bringing a user-focused perspective and cross-functional collaboration skills. Consistently performed as top contributor in development teams with expertise in TypeScript, Angular, React, and .NET." }
      ]
    },
    {
      id: "work-experience",
      title: "Work Experience",
      subSections: [
        {
          id: "dynaway-d365-developer",
          title: "Microsoft Dynamics 365 Finance and Operations Developer",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2024 - Present"
          },
          paragraphs: [
            { text: "- Developing full-stack solutions for Microsoft Dynamics 365 Finance and Operations serving enterprise clients" },
            { text: "- Building backend services and APIs using .NET, X++, and C# while collaborating with frontend teams" },
            { text: "- Achieved 10x performance improvement in data transfer between frontend and backend systems" }
          ]
        },
        {
          id: "dynaway-frontend-developer",
          title: "Frontend Web Developer",
          subtitles: {
            left: "Dynaway",
            right: "Jul 2022 - Nov 2024"
          },
          paragraphs: [
            { text: "- Built TypeScript and Angular web applications serving 100+ companies" },
            { text: "- Consistently delivered highest story points in team sprints while enhancing CI/CD pipelines" },
            { text: "- Served as Scrum Master for 5-person development team" }
          ]
        },
        {
          id: "dynaway-web-developer-marketing",
          title: "Web Developer in Marketing",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2020 - Jul 2022"
          },
          paragraphs: [
            { text: "- Extended company website with custom modules and rewrote front page for better value communication" },
            { text: "- Collaborated across departments to translate business needs into web solutions" },
            { text: "- Designed customer onboarding guides and automated email workflows in HubSpot" },
            { text: "- Created product demonstration videos supporting sales and marketing efforts" }
          ]
        },
        {
          id: "ankerimedi-cofounder",
          title: "Co-Founder",
          subtitles: {
            left: "AnkeriMedia",
            right: "Nov 2019 - Jul 2020"
          },
          paragraphs: [
            { text: "- Co-founded marketing services startup targeting Czech real estate agencies" },
            { text: "- Built company website, created marketing materials, and conducted direct outreach to potential clients" },
            { text: "- Successfully secured 50+ meetings with decision-makers and closed 5 paying customers" }
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
      title: "Projects",
      bulletPoints: [
        {
          iconName: "code",
          text: "10x Performance Improvement",
          description: "Optimized enterprise sync from 20+ min to 2 min for 1000+ technicians. SQL optimization, IndexedDB, distributed systems.",
          url: "https://kacan98.com/project-stories#10x-performance"
        },
        {
          iconName: "autoAwesome",
          text: "AI Job Application Platform",
          description: "Next.js 15 platform with GPT-5 integration for CV customization & cover letters. Multi-language support.",
          url: "https://kacan98.com"
        },
        {
          iconName: "schedule",
          text: "Git-to-JIRA Time Tracker",
          description: "Automated time logging from commits. Reduced daily tracking from 15 min to 30 sec. React, GitHub/JIRA APIs.",
          url: "https://log-bridge.vercel.app"
        },
        {
          iconName: "calculate",
          text: "Property Investment Calculator",
          description: "Real-time buy-vs-rent analysis tool with complex financial modeling. React, Redux, TypeScript.",
          url: "https://kacan98.github.io/buying-vs-renting/"
        }
      ]
    }
  ]
};