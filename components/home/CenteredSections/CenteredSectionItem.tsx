"use client";

import { Box, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";

export interface CenteredSection {
  header: string;
  content: string;
  visual?: React.ReactNode;
}

// Individual section component with slide-in animation
export default function CenteredSectionItem({ section }: { section: CenteredSection }) {
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
        threshold: 0.01, // Trigger much earlier
        rootMargin: '100px 0px' // Start loading 100px before element is in view
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
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: { xs: 6, md: 10 },
        scrollSnapAlign: 'start', // Snap this section to top of viewport
      }}
    >
      <Box sx={{ 
        textAlign: 'center', 
        maxWidth: '800px',
        px: { xs: 2, md: 0 },
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
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