// import CenteredSectionItem, { CenteredSection } from "@/components/home/CenteredSections/CenteredSectionItem";
import Contact from "@/components/home/Contact";
import Hero from "@/components/home/Hero";
import SocialIcons from "@/components/home/socialIcons";
import TechList from "@/components/home/Tech";
import Timeline, { TimelineItem } from "@/components/home/Timeline";
import ContentContainer from "@/components/layout/ContentContainer";
import ThreeDLaptop from "@/components/spline/laptop";
import { isKarelsPortfolio } from "@/globalVars";
import { SPACING } from "@/app/spacing";
import { Box, Typography } from "@mui/material";
import { AutoAwesome, Psychology, Group } from "@mui/icons-material";
import { getTranslations } from 'next-intl/server';
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
        px: SPACING.containerPadding,
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
  const t = await getTranslations('homepage');
  
  const aboutMe: Record<string, AboutSection> = {
    fullStack: {
      header: t('about.fullStack.header'),
      content: t('about.fullStack.content'),
      visual: <ThreeDLaptop />
    },
    aiEnhanced: {
      header: t('about.aiEnhanced.header'), 
      content: t('about.aiEnhanced.content'),
      visual: (
        <AutoAwesome 
          sx={{ 
            fontSize: { xs: '80px', md: '120px' },
            color: '#a855f7',
            filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))'
          }} 
        />
      )
    },
    problemSolver: {
      header: t('about.problemSolver.header'),
      content: t('about.problemSolver.content'),
      visual: (
        <Psychology 
          sx={{ 
            fontSize: { xs: '80px', md: '120px' },
            color: '#06b6d4',
            filter: 'drop-shadow(0 4px 8px rgba(6, 182, 212, 0.3))'
          }} 
        />
      )
    },
    userFocused: {
      header: t('about.userFocused.header'),
      content: t('about.userFocused.content'),
      visual: (
        <Group 
          sx={{ 
            fontSize: { xs: '80px', md: '120px' },
            color: '#10b981',
            filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))'
          }} 
        />
      )
    },
  };

  const careerTimeline: TimelineItem[] = [
    {
      title: t('timeline.jobs.fullStackDeveloper.title'),
      company: t('timeline.jobs.fullStackDeveloper.company'),
      period: t('timeline.jobs.fullStackDeveloper.period'),
      description: [
        t('timeline.jobs.fullStackDeveloper.description.0'),
        t('timeline.jobs.fullStackDeveloper.description.1'),
        t('timeline.jobs.fullStackDeveloper.description.2')
      ]
    },
    {
      title: t('timeline.jobs.frontendDeveloper.title'),
      company: t('timeline.jobs.frontendDeveloper.company'), 
      period: t('timeline.jobs.frontendDeveloper.period'),
      description: [
        t('timeline.jobs.frontendDeveloper.description.0'),
        t('timeline.jobs.frontendDeveloper.description.1'),
        t('timeline.jobs.frontendDeveloper.description.2'),
        t('timeline.jobs.frontendDeveloper.description.3')
      ]
    },
    {
      title: t('timeline.jobs.webBusinessDeveloper.title'),
      company: t('timeline.jobs.webBusinessDeveloper.company'),
      period: t('timeline.jobs.webBusinessDeveloper.period'), 
      description: [
        t('timeline.jobs.webBusinessDeveloper.description.0'),
        t('timeline.jobs.webBusinessDeveloper.description.1'),
        t('timeline.jobs.webBusinessDeveloper.description.2')
      ]
    }
  ];

  return (
    <>
      {/* Hero Section - normal scrolling */}
      <Box id="hero" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <ContentContainer fullWidth>
          <Hero firstName="Karel" lastName="Čančara" tagLine={t('hero.tagline')} />
        </ContentContainer>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, py: { xs: 2, md: 4 } }}>
          <SocialIcons direction={"column"} />
        </Box>
      </Box>
      
      {isKarelsPortfolio && (
        <>
          {/* About Me */}
          <Box>
            <AboutSectionItem section={aboutMe.fullStack} id="about-fullstack" />
            <AboutSectionItem section={aboutMe.aiEnhanced} id="about-ai" />
            <AboutSectionItem section={aboutMe.problemSolver} id="about-problem" />
            <AboutSectionItem section={aboutMe.userFocused} id="about-user" />
          </Box>

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
                title={t('timeline.title')}
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
