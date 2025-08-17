import CenteredSections, { CenteredSection } from "@/components/home/CenteredSections";
import Contact from "@/components/home/Contact";
import Hero from "@/components/home/Hero";
import SocialIcons from "@/components/home/socialIcons";
import TechList from "@/components/home/Tech";
import Timeline, { TimelineItem } from "@/components/home/Timeline";
import ContentContainer from "@/components/layout/ContentContainer";
import ThreeDLaptop from "@/components/spline/laptop";
import { isKarelsPortfolio } from "@/globalVars";
import { Box } from "@mui/material";
// import Grid2 from "@mui/material/Unstable_Grid2"; // Removed unused import

const aboutMe: CenteredSection[] = [
  {
    header: "Full-Stack Developer",
    content:
      "I work on enterprise software that hundreds of companies use daily. I write code in TypeScript, .NET, and X++, and try to make things faster and less buggy.",
    visual: <ThreeDLaptop />
  },
  {
    header: "AI-Enhanced Development", 
    content:
      "I use AI coding tools every day because they help me write code faster and catch mistakes I'd miss. Always trying out new tools to see if they make my life easier.",
  },
  {
    header: "Problem Solver",
    content:
      "I like figuring out why things break and fixing them. Most of my day is spent debugging, building features, and making sure stuff actually works.",
  },
  {
    header: "User-Focused",
    content:
      "I used to do marketing, so I think about who's actually going to use the stuff I build. I try to make software that doesn't make people want to throw their computer out the window.",
  },
];

// Career timeline data extracted from CV
const careerTimeline: TimelineItem[] = [
  {
    title: "Full Stack Developer – Dynamics 365 SCM",
    company: "Dynaway",
    period: "2024 - now",
    description: [
      "Developed backend services and APIs in X++, C#, and .NET for enterprise ERP software",
      "Collaborated with frontend and infrastructure teams to deliver end-to-end solutions",
      "Focused on performance improvements, debugging, and customer-specific features"
    ]
  },
  {
    title: "Frontend Web Developer",
    company: "Dynaway", 
    period: "2020 - 2024",
    description: [
      "Delivered new features and bug fixes in an Angular/Deno web application used by technicians",
      "Consistently delivered features on schedule as a self-taught developer",
      "Advocated for usability and design simplicity in feature discussions", 
      "Led daily and weekly Scrum meetings for a 5-person dev team as a Scrum Master"
    ]
  },
  {
    title: "Web and Business Development",
    company: "Ankeri Media",
    period: "2019-2020", 
    description: [
      "Created the company's website and led branding and outreach campaigns",
      "Booked 50+ meetings and secured new clients via cold outreach",
      "Balanced marketing and tech responsibilities in a startup environment"
    ]
  }
];

// Example technologies array for the TechList component
const technologies = [
  { name: "TypeScript", color: "#3178C6" },
  { name: "React", color: "#61DAFB" },
  { name: "Angular", color: "#DD0031" },
  { name: "Next.js", color: "#000000" },
  { name: "C#", color: "#239120" },
  { name: ".NET", color: "#512BD4" },
  { name: "X++", color: "#0078D4" },
  { name: "Node.js", color: "#339933" },
  { name: "PostgreSQL", color: "#336791" },
  { name: "Azure", color: "#0089D0" },
  { name: "AI/ML", color: "#FF6B6B" },
  { name: "Drizzle", color: "#C5F74F" },
];

export default async function App() {
  return (
    <>
      <ContentContainer fullWidth>
        <Hero firstName="Karel" lastName="Čančara" tagLine="AI-Enhanced Full-Stack Developer" />
      </ContentContainer>
      <Box sx={{ py: { xs: 2, md: 4 } }}>
        <SocialIcons direction={"column"} />
      </Box>
      {isKarelsPortfolio && (
        <>
          {/* About Me - Centered Sections */}
          <CenteredSections 
            sections={aboutMe}
          />

          {/* Technologies */}
          <Box sx={{ py: { xs: 1, md: 2 } }}>
            <TechList
              technologies={technologies}
            />
          </Box>

          {/* Career Timeline */}
          <Timeline 
            items={careerTimeline}
            title="Career Journey"
          />
        </>
      )}

      {/* Contact Section - Full Width Edge to Edge */}
      <Contact />
    </>
  );
}
