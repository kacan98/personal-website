import { CVSettings } from '@/types';

export const cvConfigEn: CVSettings = {
  on: true,
  name: "Karel Čančara",
  subtitle: "Full Stack Developer",
  profilePicture: "/images/cv/profile.jpg",
  mainColumn: [
    {
      title: "Profile",
      paragraphs: [
        "Detail-oriented and user-focused full stack developer with a strong frontend foundation and growing backend experience. Adept in TypeScript, Angular, React, Node.js, and C#, with hands-on experience in Microsoft Dynamics (X++/C#). Known for a proactive mindset, strong communication skills, and a solid track record of delivering features in complex enterprise systems.\n\n",
        "I transitioned into development from a marketing background, bringing a unique ability to think from the user's perspective, contribute to product direction, and collaborate across departments. I learn fast, take ownership, and consistently deliver — topping story points in team sprints despite being self-taught.",
        "Now looking to grow in a hybrid or on-site full stack role around Copenhagen, ideally in a modern tech stack with backend exposure to C#/.NET or Node.js."
      ]
    },
    {
      title: "Work Experience",
      subSections: [
        {
          title: "Full Stack Developer – Dynamics 365 SCM",
          subtitles: {
            left: "Dynaway",
            right: "2024 - now"
          },
          paragraphs: [
            "- Developed backend services and APIs in X++, C#, and .NET for enterprise ERP software. Integrated with Microsoft Graph.",
            "- Collaborated with frontend and infrastructure teams to deliver end-to-end solutions\n",
            "- Focused on performance improvements, debugging, and customer-specific features",
            "10x increased the speed of data transfer between frontend and backend "
          ]
        },
        {
          title: "Frontend Web Developer",
          subtitles: {
            left: "Dynaway",
            right: "2020 - 2024"
          },
          paragraphs: [
            "- Delivered new features and bug fixes in an Angular/Deno web application used by technicians\n",
            "- Contributed highest number of story points in many sprints",
            "- Advocated for usability and design simplicity in feature discussions\n",
            "- Led daily and weekly Scrum meetings for a 5-person dev team as a Scrum Master."
          ]
        },
        {
          title: "Web and Business Development",
          subtitles: {
            left: "Ankeri Media",
            right: "2019-2020"
          },
          paragraphs: [
            "- Created the company's website and led branding and outreach campaigns",
            "- Booked 50+ meetings and secured new clients via cold outreach",
            "- Balanced marketing and tech responsibilities in a startup environment"
          ]
        }
      ]
    }
  ],
  sideColumn: [
    {
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
      title: "Projects",
      subtitles: {
        left: "...that I've worked on in my free time (among others)"
      },
      bulletPoints: [
        {
          iconName: "gitHub",
          text: "Buying vs Renting Calculator (React, MUI, Redux)",
          url: "https://kacan98.github.io/buying-vs-renting/"
        },
        {
          iconName: "gitHub",
          text: "Portfolio (Next.js/React + Markdown)",
          url: "https://github.com/kacan98/my-porfolio"
        },
        {
          iconName: "gitHub",
          text: "Reviewing App (Angular +.NET + SQL)",
          url: "https://github.com/kacan98/r8tit"
        },
        {
          iconName: "gitHub",
          text: "Common Birthday Calculator (Angular + Ionic)",
          url: "https://kacan98.github.io/common-age-calculator/"
        }
      ]
    }
  ]
};