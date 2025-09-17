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
import { useState, useEffect, useRef } from "react";

interface AboutSection {
  header: string;
  content: string;
  visualType?: 'laptop' | 'ai' | 'problem' | 'user';
}

// Simple inline component for about sections
function AboutSectionItem({ section, id, index }: { section: AboutSection; id: string; index: number }) {
  const isEven = index % 2 === 0;
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRevealed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isRevealed) {
          setIsRevealed(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px' // Start animation 50px before element is in view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isRevealed]);

  return (
    <Box
      ref={sectionRef}
      id={id}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 10 },
        scrollSnapAlign: 'start',
        overflow: 'hidden', // Prevent content from showing during slide
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' },
        alignItems: 'center',
        gap: { xs: 4, md: 6, lg: 8 },
        maxWidth: '1200px',
        width: '100%',
        px: SPACING.containerPadding,
      }}>
        {/* Text Content */}
        <Box sx={{
          flex: 1,
          textAlign: { xs: 'center', md: 'left' },
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed
            ? 'translateX(0)'
            : isEven
              ? 'translateX(-60px)'
              : 'translateX(60px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          transitionDelay: '0.1s',
        }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s',
            }}
          >
            {section.header}
          </Typography>

          <Typography
            variant="h5"
            component="div"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.8,
              fontSize: { xs: '1.2rem', md: '1.3rem', lg: '1.4rem' },
              fontWeight: 300,
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s',
            }}
          >
            {section.content}
          </Typography>
        </Box>

        {/* Visual Content */}
        {section.visualType && (
          <Box sx={{
            flex: { xs: 'none', md: '0 0 45%' },
            width: { xs: '100%', md: 'auto' },
            height: { xs: '250px', sm: '300px', md: '350px', lg: '400px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            order: { xs: -1, md: 0 }, // On mobile, show visual above text
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed
              ? 'translateX(0) scale(1)'
              : isEven
                ? 'translateX(60px) scale(0.95)'
                : 'translateX(-60px) scale(0.95)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            transitionDelay: '0.3s',
          }}>
            <AboutVisual type={section.visualType} />
          </Box>
        )}
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
            <AboutSectionItem section={aboutMe.fullStack} id="about-fullstack" index={0} />
            <AboutSectionItem section={aboutMe.aiEnhanced} id="about-ai" index={1} />
            <AboutSectionItem section={aboutMe.problemSolver} id="about-problem" index={2} />
            <AboutSectionItem section={aboutMe.userFocused} id="about-user" index={3} />
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