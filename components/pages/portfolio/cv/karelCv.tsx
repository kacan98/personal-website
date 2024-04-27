import React from "react";
import Cv from "@/components/pages/portfolio/cv/cv";
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
import { karelsProjects } from "@/store/staticObjects";

function KarelCv() {
  return (
    <Cv
      name="Karel Čančara"
      intro="Frontend Developer and Scrum Master at Dynaway"
      picture="/færøerne_karel.jpg"
      sideSection={[
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
      ]}
      mainSection={[
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
              url: project.url,
            }))
            .sort((a, b) => a.text.localeCompare(b.text)),
        },
      ]}
    />
  );
}

export default KarelCv;
