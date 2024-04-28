import {
  Email,
  GitHub,
  LibraryBooks,
  LinkedIn,
  Phone,
  School,
  Science,
  Translate,
} from "@mui/icons-material";

export const karelsProjects = [
  {
    title: "Common Birthday Calculator",
    description: "Calculates the common birthday of a group of people",
    image: "/common-age-calculator.png",
    tags: ["Angular", "TypeScript"],
    githubUrl: "https://github.com/kacan98/common-age-calculator",
    deploymentUrl: "https://kacan98.github.io/common-age-calculator/",
  },
  {
    title: "R8tit",
    description: "An app for rating supermarkets",
    image: "/r8tit.png",
    tags: ["C#", "SQL", "Angular", "TypeScript"],
    githubUrl: "https://github.com/kacan98/r8tit",
    deploymentUrl: "https://r8tit.azurewebsites.net/",
  },
  {
    title: "Buying vs Renting",
    description: "A calculator for buying vs renting a property",
    image: "/buying-vs-renting.png",
    tags: ["React", "TypeScript", "Redux"],
    githubUrl: "https://github.com/kacan98/buying-vs-renting",
    deploymentUrl: "https://kacan98.github.io/buying-vs-renting/",
  },
  {
    title: "My Portfolio Website",
    description: "My Portfolio Website",
    image: "/portfolio.png",
    tags: ["Next.js", "TypeScript", "React", "Next.js"],
    githubUrl: "https://github.com/kacan98/my-porfolio",
    deploymentUrl: "https://my-porfolio-sigma-murex.vercel.app/",
  },
  {
    title: "Teams app",
    description: "An app for managing teams",
    image: "/teams-app.png",
    tags: ["Angular", "TypeScript"],
    githubUrl: "https://github.com/josef-kriz/team-app",
    deploymentUrl: "https://josef-kriz.github.io/team-app/",
  },
];

export const karelCvData = {
  name: "Karel Čančara",
  intro: "Frontend Developer and Scrum Master at Dynaway",
  sections: [
    {
      title: "Contact",
      bulletPoints: [
        {
          text: "karel.cancara@gmail.com",
          icon: Email,
          url: "mailto:karel.cancara@gmail.com",
        },
        { text: "+45 91 88 91 72", icon: Phone, url: "tel:+4591889172" },
        { text: "GitHub", icon: GitHub, url: "https://github.com/kacan98" },
        {
          text: "LinkedIn",
          icon: LinkedIn,
          url: "https://www.linkedin.com/in/kcancara",
        },
      ],
    },
    {
      title: "Skills",
      bulletPoints: [
        {
          text: "Languages: TypeScript, JavaScript, C#, (HTML, CSS)",
          icon: Translate,
        },
        {
          text: "Frameworks: Angular, React, .NET, Node.js, Deno",
          icon: LibraryBooks,
        },
        { text: "Tools: Git, GitHub, BitBucket", icon: GitHub },
        { text: "Testing: Jasmine, Karma", icon: Science },
        { text: "CI/CD: GitHub Workflows/Actions", icon: GitHub },
      ],
    },
    {
      title: "Education",
      bulletPoints: [
        {
          icon: School,
          text: "Online courses, Udemy, Google, Chat GPT, etc.",
        },
        {
          icon: School,
          text: "Bachelor's degree in International Sales and Marketing",
        },
      ],
    },
    {
      title: "Languages",
      bulletPoints: [
        { icon: Translate, text: "Czech (native)" },
        { icon: Translate, text: "English (fluent)" },
        { icon: Translate, text: "Danish (conversational)" },
        { icon: Translate, text: "Swedish (conversational)" },
        { icon: Translate, text: "German (conversational)" },
      ],
    },
    {
      title: "Profile",
      contents: [
        "Experienced Frontend Developer with a strong focus on user experience and clean, maintainable code. Proficient in Angular, TypeScript, JavaScript, and unit testing.",
        "I have little bit of experience with Deno, Node.js, C#/.NET, and CI/CD pipelines (GitHub Workflows/Actions).",
        "I would like to bring technical skills and a customer-centric perspective to a dynamic team.",
        "I'm passionate about continuous learning and delivering value to users. I am a continuous learner, regularly taking Udemy courses and self-studying new technologies.",
      ],
    },
    {
      title: "Work Experience",
      subSections: [
        {
          title: "Frontend Developer and Scrum Master",
          subtitles: {
            left: "Dynaway",
            right: "2022 - Present",
          },
          contents: [
            "Developed and maintained several enterprise web applications for utilized by maintenance technicians worldwide, embeded into Microsoft ERP solutions.",
            "Implemented new features and fixed bugs in Angular TypeScript and writing tests in Jasmine and Karma.",
            "Scrum Master for a team of 5 developers.",
          ],
        },
        {
          title: "Web Developer and Marketer",
          subtitles: {
            left: "Dynaway",
            right: "2020 - 2022",
          },
          contents: [
            "Started by creating marketing materials and then transitioned to developing the company website.",
            "Also created many marketing videos",
          ],
        },
      ],
    },
    {
      title: "Projects",
      bulletPoints: karelsProjects
        .map((project) => ({
          text: `${project.title} (${project.tags.join(", ")})`,
          icon: LibraryBooks,
          url: project.githubUrl,
        }))
        .sort((a, b) => a.text.localeCompare(b.text)),
    },
  ],
};
