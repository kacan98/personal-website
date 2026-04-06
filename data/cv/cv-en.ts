// Data is loose/partial - Zod will parse and fill in required fields with defaults
import { getMailtoHref, getSiteHost, settings } from "@/data/settings";

export const cvConfigEn = {
  on: true,
  name: "Karel Čančara",
  subtitle: "Full Stack Developer | TypeScript, Angular, React, D365 SCM, .NET",
  profilePicture: "/images/cv/profile.jpg",
  mainColumn: [
    {
      id: "profile",
      title: "Profile",
      paragraphs: [
        { text: "Full Stack Developer with 4+ years of experience building enterprise software, internal tools, and workflow improvements." },
        { text: "Comfortable across frontend and backend, from interfaces and APIs to integrations and performance work. Strongest in TypeScript, Angular, React, X++, and .NET-based environments." }
      ]
    },
    {
      id: "work-experience",
      title: "Work Experience",
      subSections: [
        {
          id: "dynaway-full-stack-developer",
          title: "Full Stack Developer",
          subtitles: {
            left: "Dynaway",
            right: "Jul 2025 - Present"
          },
          paragraphs: [
            { text: "- Build frontend and backend features in Microsoft Dynamics 365 Supply Chain Management, including interfaces, endpoints, integrations, and workflow improvements" },
            { text: "- Work in TypeScript, X++, and .NET-based environments to support real operational processes" },
            { text: "- Built internal developer tooling, including a Jira/GitHub dashboard that surfaces tasks, PRs, failing pipelines, merge conflicts, and comments in one place" },
            { text: "- Improved critical data transfer performance by roughly 10x in production systems" }
          ]
        },
        {
          id: "dynaway-d365-scm-xpp-developer",
          title: "D365 SCM X++ Developer",
          subtitles: {
            left: "Dynaway",
            right: "Nov 2024 - Jul 2025"
          },
          paragraphs: [
            { text: "- Developed backend logic and ERP customizations in Microsoft Dynamics 365 Supply Chain Management using X++ and related platform tooling" },
            { text: "- Built endpoints and business logic supporting frontend workflows and enterprise client requirements" }
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
            { text: "- Built TypeScript and Angular web applications used by 100+ companies" },
            { text: "- Improved CI/CD workflows and delivery speed across the team" },
            { text: "- Served as Scrum Master for a 5-person development team" }
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
            { text: "- Built CMS-integrated website modules and improved product/value presentation across the site" },
            { text: "- Worked with teams across the company to translate product capabilities into effective web solutions" },
            { text: "- Designed onboarding content and automated email workflows in HubSpot" }
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
            { text: "- Co-founded a marketing services startup focused on Czech real estate agencies" },
            { text: "- Built the company website, created materials, and handled outbound outreach" },
            { text: "- Secured 50+ meetings with decision-makers and closed 5 paying customers" }
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
      title: "Skills",
      bulletPoints: [
        {
          iconName: "translate",
          text: "Languages: TypeScript, JavaScript, X++, C#"
        },
        {
          iconName: "translate",
          text: "Frameworks: Angular, React, .NET, Node.js, Express"
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
        },
        {
          iconName: "translate",
          text: "Czech (native)"
        }
      ]
    },
    {
      id: "personal-projects",
      title: "Projects",
      bulletPoints: [
        {
          iconName: "speed",
          text: "10x Performance Improvement",
          description: "Reduced a production synchronization flow from 20+ minutes to under 2 minutes for a technician-facing enterprise workflow.",
          url: "/en/projects/10x-performance-improvement"
        },
        {
          iconName: "schedule",
          text: "Git-to-Jira Bridge",
          description: "Automated Jira time logging from Git activity to remove repetitive manual reporting and keep worklogs closer to real development flow.",
          url: "/en/projects/git-to-jira-bridge"
        },
        {
          iconName: "dashboard",
          text: "Developer Task Overview Dashboard",
          description: "Internal dashboard that combines Jira tasks, PRs, failing checks, conflicts, and branch follow-up into one action-oriented view.",
          url: "/en/projects/developer-task-overview-dashboard"
        },
        {
          iconName: "psychology",
          text: "AI Job Application Platform",
          description: "Password-gated CV workflow with AI tailoring, diff review, translation, and a browser-to-application flow for faster customization.",
          url: "/en/projects/ai-job-application-platform"
        }
      ]
    }
  ]
};
