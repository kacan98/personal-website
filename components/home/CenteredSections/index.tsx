"use client";

import { Box, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";

export interface CenteredSection {
  header: string;
  content: string;
  visual?: React.ReactNode; // Optional visual element for the section
}

interface CenteredSectionsProps {
  sections: CenteredSection[];
  title?: string;
}

// Individual section component with slide-in animation
function CenteredSectionItem({ section, index }: { section: CenteredSection; index: number }) {
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
      { threshold: 0.2 }
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
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: { xs: 6, md: 10 }
      }}
    >
      <Box sx={{ 
        textAlign: 'center', 
        maxWidth: '800px',
        px: { xs: 2, md: 0 },
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        transitionDelay: `${index * 0.2}s`,
      }}>
        <Typography 
          variant="h2" 
          component="h2"
          sx={{ 
            mb: 4,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: { xs: '3rem', md: '4rem' }
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

export default function CenteredSections({ sections, title }: CenteredSectionsProps) {
  const [isTitleRevealed, setIsTitleRevealed] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTitleRevealed) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTitleRevealed) {
          setIsTitleRevealed(true);
        }
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, [isTitleRevealed]);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      {title && (
        <Box ref={titleRef}>
          <Typography 
            variant="h3" 
            sx={{ 
              textAlign: 'center', 
              mb: 6, 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: { xs: '2rem', md: '3rem' },
              opacity: isTitleRevealed ? 1 : 0,
              transform: isTitleRevealed ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
      
      {sections.map((section, index) => (
        <CenteredSectionItem key={section.header} section={section} index={index} />
      ))}
    </Box>
  );
}