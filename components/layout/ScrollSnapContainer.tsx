"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

export default function ScrollSnapContainer({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const touchStartY = useRef(0);

  // Collect all section elements with retry mechanism
  useEffect(() => {
    const collectSections = () => {
      if (!containerRef.current) return false;
      
      // Find all direct children that should be scroll snap points
      // Skip elements with data-skip-snap="true"
      const sections = Array.from(containerRef.current.children).filter(
        (child) => {
          const element = child as HTMLElement;
          return child.tagName !== 'SCRIPT' && 
                 child.tagName !== 'STYLE' && 
                 element.getAttribute('data-skip-snap') !== 'true';
        }
      ) as HTMLElement[];
      
      if (sections.length > 0) {
        sectionsRef.current = sections;
        return true;
      }
      return false;
    };

    // Try immediately
    if (!collectSections()) {
      // If no sections found, retry after a short delay
      const retryTimeout = setTimeout(() => {
        if (!collectSections()) {
          // Final retry after DOM is definitely ready
          setTimeout(collectSections, 1000);
        }
      }, 100);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [children, isMobile]);

  // Scroll to a specific section
  const scrollToSection = useCallback((index: number) => {
    if (isScrolling || !sectionsRef.current[index]) return;
    
    setIsScrolling(true);
    setCurrentSection(index);
    
    sectionsRef.current[index].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, [isScrolling]);

  // Handle wheel events
  const handleWheel = useCallback((e: WheelEvent) => {
    // Don't do anything on mobile or if sections aren't loaded yet
    if (isMobile || sectionsRef.current.length === 0) {
      return;
    }
    
    // Only handle wheel events if we have a moderate scroll speed
    // This prevents rapid scrolling from triggering unintended behavior
    if (Math.abs(e.deltaY) > 100) {
      return; // Let very fast scrolling pass through normally
    }
    
    // Check if we're in the snap zone by looking at the first snap section
    const firstSnapSection = sectionsRef.current[0];
    const lastSnapSection = sectionsRef.current[sectionsRef.current.length - 1];
    
    if (firstSnapSection && lastSnapSection) {
      const firstRect = firstSnapSection.getBoundingClientRect();
      const lastRect = lastSnapSection.getBoundingClientRect();
      
      // Allow scrolling up to hero when we're at the first snap section
      if (currentSection === 0 && e.deltaY < 0) {
        // Always allow scrolling back to hero from first snap section
        return;
      }
      
      // If we're above the snap zone (in hero section), allow normal scrolling
      // Only activate snap when first section is mostly visible
      if (firstRect.top > window.innerHeight * 0.8) {
        return;
      }
      
      // If we're scrolling down into the snap area from hero, make sure we land on first section
      if (firstRect.top > 0 && firstRect.top < window.innerHeight * 0.8 && e.deltaY > 0) {
        e.preventDefault();
        scrollToSection(0); // Force scroll to first section
        return;
      }
      
      // If we're below the last snap section, allow normal scrolling
      if (lastRect.bottom < 0) {
        return;
      }
      
      // If we're at the last snap section and scrolling down, allow normal scrolling
      if (currentSection === sectionsRef.current.length - 1 && e.deltaY > 0) {
        return;
      }
    }
    
    e.preventDefault();
    
    if (isScrolling) return;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const nextSection = currentSection + direction;
    
    if (nextSection >= 0 && nextSection < sectionsRef.current.length) {
      scrollToSection(nextSection);
    }
  }, [currentSection, isScrolling, scrollToSection, isMobile]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isMobile || isScrolling) return;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      const nextSection = Math.min(currentSection + 1, sectionsRef.current.length - 1);
      if (nextSection !== currentSection) {
        scrollToSection(nextSection);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const prevSection = Math.max(currentSection - 1, 0);
      if (prevSection !== currentSection) {
        scrollToSection(prevSection);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSection(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSection(sectionsRef.current.length - 1);
    }
  }, [currentSection, isScrolling, scrollToSection, isMobile]);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isMobile) return;
    touchStartY.current = e.touches[0].clientY;
  }, [isMobile]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (isMobile || isScrolling) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      const direction = diff > 0 ? 1 : -1;
      const nextSection = currentSection + direction;
      
      if (nextSection >= 0 && nextSection < sectionsRef.current.length) {
        scrollToSection(nextSection);
      }
    }
  }, [currentSection, isScrolling, scrollToSection, isMobile]);

  // Set up event listeners
  useEffect(() => {
    // Only add event listeners on desktop
    if (!isMobile) {
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleWheel, handleKeyDown, handleTouchStart, handleTouchEnd, isMobile]);

  // Update current section based on scroll position (for scrollbar dragging)
  useEffect(() => {
    // Only track scroll position on desktop
    if (isMobile) return;
    
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (isScrolling) return;
      
      // Debounce scroll detection to avoid conflicts
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const _scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Find which section is most visible
        let closestSection = 0;
        let closestDistance = Infinity;
        
        for (let i = 0; i < sectionsRef.current.length; i++) {
          const section = sectionsRef.current[i];
          if (section) {
            const rect = section.getBoundingClientRect();
            const sectionMiddle = rect.top + rect.height / 2;
            const distance = Math.abs(sectionMiddle - windowHeight / 2);
            
            if (distance < closestDistance) {
              closestDistance = distance;
              closestSection = i;
            }
          }
        }
        
        if (currentSection !== closestSection && !isScrolling) {
          setCurrentSection(closestSection);
        }
      }, 100); // Debounce by 100ms
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentSection, isScrolling, isMobile]);

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      {children}
    </Box>
  );
}