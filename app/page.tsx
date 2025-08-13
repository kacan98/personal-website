import Hero from "@/components/home/Hero";
import SocialIcons from "@/components/home/socialIcons";
import TechList from "@/components/home/Tech";
import Timeline, { TimelineItem } from "@/components/home/Timeline";
import CenteredSections, { CenteredSection } from "@/components/home/CenteredSections";
import Contact from "@/components/home/Contact";
import ContentContainer from "@/components/layout/ContentContainer";
import ThreeDLaptop from "@/components/spline/laptop";
import { isKarelsPortfolio } from "@/globalVars";
import { Box, Typography } from "@mui/material";
// import Grid2 from "@mui/material/Unstable_Grid2"; // Removed unused import

const aboutMe: CenteredSection[] = [
  {
    header: "Web developer",
    content:
      "I am a web developer, mainly with experience on the frontend side, but also with some backend experience. I love the challenge of bringing a design to life and making it functional.",
    visual: <ThreeDLaptop />
  },
  {
    header: "Unique user insights",
    content:
      "I studied and worked in marketing before I found my true passion in coding. I love to combine my customer-centric approach with my technical skills to create the best possible solutions.",
  },
  {
    header: "Fast learner",
    content:
      "I'm always learning new technologies. I'm no stranger to diving into the unknown.",
  },
  {
    header: "Passionate about design",
    content:
      "Apart from coding, I've spent countless hours designing graphics, animations, wireframes and mockups.",
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
      "Consistently deliver — topping story points in team sprints despite being self-taught",
      "Contributed highest number of story points in many sprints",
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
  { name: "Node.js", color: "#339933" },
  { name: "Angular", color: "#DD0031" },
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#000000" },
  { name: "C#", color: "#239120" },
  { name: ".NET", color: "#F7DF1E" },
];

export default async function App() {
  return (
    <>
      <ContentContainer fullWidth>
        <Hero firstName="Karel" lastName="Čančara" tagLine="Software Developer" />
      </ContentContainer>
      <Box sx={{ py: { xs: 1, md: 2 } }}>
        <TechList
          technologies={technologies}
        />
      </Box>
      <Box sx={{ py: { xs: 2, md: 4 } }}>
        <SocialIcons direction={"column"} />
      </Box>
      {isKarelsPortfolio && (
        <>
          {/* About Me - Centered Sections */}
          <CenteredSections 
            sections={aboutMe}
          />

          {/* Career Timeline */}
          <Timeline 
            items={careerTimeline}
            title="Career Journey"
          />
        </>
      )}

      {/* Contact Section - Full Width Edge to Edge */}
      <Contact />

      <ContentContainer fullWidth>
        <Box
          sx={{
            py: { xs: 4, md: 6 },
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            mt: { xs: 6, md: 10 }
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "center",
              fontSize: '0.9rem',
              fontWeight: 300,
            }}
          >
            © Karel Čančara {new Date().getFullYear()}
          </Typography>
        </Box>
      </ContentContainer>
    </>
  );
}
