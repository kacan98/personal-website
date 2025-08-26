'use client';

import Contact from "@/components/home/Contact";
import Hero from "@/components/home/Hero";
import SocialIcons from "@/components/home/socialIcons";
import TechList from "@/components/home/Tech";
import Timeline, { TimelineItem } from "@/components/home/Timeline";
import ContentContainer from "@/components/layout/ContentContainer";
import AboutVisual from "@/components/home/AboutVisual";
import { isKarelsPortfolio } from "@/globalVars";
import { SPACING } from "@/app/spacing";
import { Box, Typography } from "@mui/material";
import { Link } from "@/types";

interface AboutSection {
  header: string;
  content: string;
  visualType?: 'laptop' | 'ai' | 'problem' | 'user';
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
        
        {section.visualType && (
          <Box sx={{ 
            mb: 4, 
            height: { xs: '250px', md: '300px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AboutVisual type={section.visualType} />
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

interface HomePageContentProps {
  heroTagline: string;
  aboutMe: Record<string, AboutSection>;
  careerTimeline: TimelineItem[];
  timelineTitle: string;
  technologies: Array<{ name: string; color: string }>;
  socials: Link[];
}

export default function HomePageContent({ 
  heroTagline, 
  aboutMe, 
  careerTimeline, 
  timelineTitle,
  technologies,
  socials 
}: HomePageContentProps) {
  return (
    <>
      {/* Hero Section - normal scrolling */}
      <Box id="hero" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <ContentContainer fullWidth>
          <Hero firstName="Karel" lastName="Čančara" tagLine={heroTagline} />
        </ContentContainer>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, py: { xs: 2, md: 4 } }}>
          <SocialIcons direction={"column"} socials={socials} />
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
                title={timelineTitle}
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