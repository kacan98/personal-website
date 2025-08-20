// import CenteredSectionItem, { CenteredSection } from "@/components/home/CenteredSections/CenteredSectionItem";
import Contact from "@/components/home/Contact";
import Hero from "@/components/home/Hero";
import SocialIcons from "@/components/home/socialIcons";
import TechList from "@/components/home/Tech";
import Timeline, { TimelineItem } from "@/components/home/Timeline";
import ContentContainer from "@/components/layout/ContentContainer";
import ScrollSnapContainer from "@/components/layout/ScrollSnapContainer";
import ThreeDLaptop from "@/components/spline/laptop";
import { isKarelsPortfolio } from "@/globalVars";
import { Box, Typography } from "@mui/material";
// import Grid2 from "@mui/material/Unstable_Grid2"; // Removed unused import

interface AboutSection {
  header: string;
  content: string;
  visual?: React.ReactNode;
}

// Simple inline component for about sections
function AboutSectionItem({ section, id }: { section: AboutSection; id: string }) {
  return (
    <Box 
      id={id}
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: { xs: 6, md: 10 },
        scrollSnapAlign: 'start',
      }}
    >
      <Box sx={{ 
        textAlign: 'center', 
        maxWidth: '800px',
        px: { xs: 2, md: 0 },
      }}>
        <Typography 
          variant="h2" 
          component="h2"
          sx={{ 
            mb: 4,
            fontWeight: 600,
            color: 'text.primary',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          {section.header}
        </Typography>
        
        {section.visual && (
          <Box sx={{ 
            mb: 4, 
            height: { xs: '250px', md: '300px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {section.visual}
          </Box>
        )}
        
        <Typography 
          variant="h5" 
          component="div"
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.8,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            fontWeight: 300,
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          {section.content}
        </Typography>
      </Box>
    </Box>
  );
}

const aboutMe: Record<string, AboutSection> = {
  fullStack: {
    header: "Full-Stack Developer",
    content:
      "I work on enterprise software that hundreds of companies use daily. I write code in TypeScript, .NET, and X++, and try to make things faster and less buggy.",
    visual: <ThreeDLaptop />
  },
  aiEnhanced: {
    header: "AI-Enhanced Development", 
    content:
      "I use AI coding tools every day because they help me write code faster and catch mistakes I'd miss. Always trying out new tools to see if they make my life easier.",
  },
  problemSolver: {
    header: "Problem Solver",
    content:
      "I like figuring out why things break and fixing them. Most of my day is spent debugging, building features, and making sure stuff actually works.",
  },
  userFocused: {
    header: "User-Focused",
    content:
      "I used to do marketing, so I think about who's actually going to use the stuff I build. I try to make software that doesn't make people want to throw their computer out the window.",
  },
};

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
      {/* Hero Section - normal scrolling */}
      <Box id="hero" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <ContentContainer fullWidth>
          <Hero firstName="Karel" lastName="Čančara" tagLine="AI-Enhanced Full-Stack Developer" />
        </ContentContainer>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, py: { xs: 2, md: 4 } }}>
          <SocialIcons direction={"column"} />
        </Box>
      </Box>
      
      {isKarelsPortfolio && (
        <>
          {/* About Me - Scroll snap only for these 4 sections */}
          <ScrollSnapContainer>
            <AboutSectionItem section={aboutMe.fullStack} id="about-fullstack" />
            <AboutSectionItem section={aboutMe.aiEnhanced} id="about-ai" />
            <AboutSectionItem section={aboutMe.problemSolver} id="about-problem" />
            <AboutSectionItem section={aboutMe.userFocused} id="about-user" />
          </ScrollSnapContainer>

          {/* Technologies - normal scrolling */}
          <Box id="technologies" sx={{ py: { xs: 1, md: 2 }, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <TechList
              technologies={technologies}
            />
          </Box>

          {/* Career Timeline - normal scrolling */}
          <Box id="timeline" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <ContentContainer>
              <Timeline 
                items={careerTimeline}
                title="Career Journey"
              />
            </ContentContainer>
          </Box>
        </>
      )}

      {/* Contact Section - normal scrolling */}
      <Box id="contact" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Contact />
      </Box>
    </>
  );
}
