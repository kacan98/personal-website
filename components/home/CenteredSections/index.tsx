"use client";

import { Box, Typography } from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";

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
export function CenteredSectionItem({ section, index: _index }: { section: CenteredSection; index: number }) {
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
        scrollSnapStop: 'always', // Always stop at this section
      }}
    >
      <Box sx={{ 
        textAlign: 'center', 
        maxWidth: '800px',
        px: { xs: 2, md: 0 },
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out', // Much faster animation
        transitionDelay: '0s', // No delay
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
  const [currentSection, setCurrentSection] = useState(-1); // Start at -1 (not in sections yet)
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const isScrolling = useRef(false);
  const isInSectionsArea = useRef(false);

  // Add refs to array
  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      sectionsRef.current[index] = el;
    }
  };

  // Handle wheel scrolling
  const handleWheel = useCallback((e: WheelEvent) => {
    // Only prevent default and handle scrolling if we're in the sections area
    if (!isInSectionsArea.current) return;
    
    e.preventDefault();
    
    if (isScrolling.current) return;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    
    // Determine target section
    let targetSection = currentSection;
    
    if (direction === 1) { // Scrolling down
      if (currentSection < sections.length - 1) {
        targetSection = currentSection + 1;
      } else {
        return; // Already at last section
      }
    } else { // Scrolling up
      if (currentSection > -1) {
        targetSection = currentSection - 1;
      } else {
        return; // Already at hero
      }
    }
    
    // Execute scroll
    isScrolling.current = true;
    setCurrentSection(targetSection);
    
    if (targetSection === -1) {
      // Scroll to hero section (top of page)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (targetSection >= 0 && targetSection < sections.length) {
      // Scroll to one of the centered sections
      const targetElement = sectionsRef.current[targetSection];
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    
    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrolling.current = false;
    }, 800); // Slightly shorter for better responsiveness
  }, [currentSection, sections.length]);

  // Set up event listeners and section detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInSectionsArea.current || isScrolling.current) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSection < sections.length - 1) {
          const nextSection = currentSection + 1;
          setCurrentSection(nextSection);
          sectionsRef.current[nextSection]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSection === 0) {
          // Go back to hero from first section
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setCurrentSection(-1);
        } else if (currentSection > 0) {
          const prevSection = currentSection - 1;
          setCurrentSection(prevSection);
          sectionsRef.current[prevSection]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Detect current visible section and manage scroll hijacking
    const detectCurrentSection = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Check if we're at the hero section
      if (scrollY < windowHeight * 0.5) {
        if (currentSection !== -1) {
          setCurrentSection(-1);
        }
      } else {
        // Check which section is most visible
        for (let i = 0; i < sectionsRef.current.length; i++) {
          const section = sectionsRef.current[i];
          if (section) {
            const rect = section.getBoundingClientRect();
            const sectionMiddle = rect.top + rect.height / 2;
            
            // If section middle is in viewport
            if (sectionMiddle >= 0 && sectionMiddle <= windowHeight) {
              if (currentSection !== i) {
                setCurrentSection(i);
              }
              break;
            }
          }
        }
      }
      
      // Determine if we should enable scroll hijacking
      const firstSection = sectionsRef.current[0];
      if (firstSection) {
        const firstRect = firstSection.getBoundingClientRect();
        // Enable hijacking if we're near or in the sections area
        const shouldHijack = scrollY < windowHeight * 1.5 || firstRect.top <= windowHeight;
        isInSectionsArea.current = shouldHijack;
      }
    };

    // Add listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', detectCurrentSection);
    
    // Initial detection
    detectCurrentSection();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', detectCurrentSection);
    };
  }, [handleWheel, currentSection, sections.length]);

  useEffect(() => {
    if (isTitleRevealed) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTitleRevealed) {
          setIsTitleRevealed(true);
        }
      },
      { 
        threshold: 0.01,
        rootMargin: '100px 0px'
      }
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
    <Box sx={{ py: { xs: 4, md: 6 }, position: 'relative' }}>
      {/* Section Dots Navigation */}
      <Box
        sx={{
          position: 'fixed',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {/* Hero dot */}
        <Box
          onClick={() => {
            setCurrentSection(-1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: currentSection === -1 ? '#f59e0b' : 'rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            mb: 1,
            '&:hover': {
              backgroundColor: currentSection === -1 ? '#f59e0b' : 'rgba(255, 255, 255, 0.5)',
              transform: 'scale(1.2)',
            },
          }}
          title="Hero Section"
        />
        
        {/* Section dots */}
        {sections.map((_, index) => (
          <Box
            key={index}
            onClick={() => {
              setCurrentSection(index);
              sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: currentSection === index ? '#f59e0b' : 'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: currentSection === index ? '#f59e0b' : 'rgba(255, 255, 255, 0.5)',
                transform: 'scale(1.2)',
              },
            }}
            title={sections[index].header}
          />
        ))}
      </Box>
      
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
              transform: isTitleRevealed ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
      
      {sections.map((section, index) => (
        <Box key={section.header} ref={(el: HTMLDivElement | null) => addToRefs(el, index)}>
          <CenteredSectionItem section={section} index={index} />
        </Box>
      ))}
    </Box>
  );
}