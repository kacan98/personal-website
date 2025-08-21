"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";

export interface TechItem {
  name: string;
  color?: string;
}

export type TechListProps = {
  title?: string;
  technologies: TechItem[];
};

const TechList = ({ title, technologies }: TechListProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1200); // Default width
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Track screen width changes
  useEffect(() => {
    const updateWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    
    // Set initial width
    updateWidth();
    
    // Add resize listener
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calculate optimal item distribution based on screen width
  const calculateItemLayout = (techName: string) => {
    // Estimate text width based on font size and screen width
    const baseFontSize = screenWidth < 600 ? 48 : screenWidth < 900 ? 64 : screenWidth < 1200 ? 80 : 96; // px
    const estimatedTextWidth = techName.length * baseFontSize * 0.6; // Rough character width
    const gap = screenWidth < 600 ? 16 : screenWidth < 900 ? 32 : 48; // Gap between items
    const itemWidth = estimatedTextWidth + gap;
    
    // How many items fit on screen
    const itemsOnScreen = Math.floor(screenWidth / itemWidth);
    const totalItems = Math.max(12, itemsOnScreen * 3); // At least 12, or 3x screen capacity
    
    // Calculate spacing between highlighted items
    // Want 1-2 highlighted items visible at once
    const targetVisibleHighlights = screenWidth < 600 ? 1 : screenWidth < 1200 ? 1 : 2;
    const highlightSpacing = Math.floor(totalItems / (targetVisibleHighlights * 2)); // Distribute evenly
    
    return {
      totalItems,
      highlightSpacing: Math.max(3, highlightSpacing), // At least every 3rd item
      itemsOnScreen
    };
  };

  // Reveal animation when component comes into view
  useEffect(() => {
    if (isRevealed) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isRevealed) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isRevealed]);

  return (
    <Box
      ref={containerRef}
      component="section"
      sx={{
        overflow: "hidden",
        py: { xs: 4, md: 6 },
        width: "100%",
        position: 'relative', // Add relative positioning for absolute gradients
      }}
    >
      {/* Edge gradients - cover entire section including padding */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '80px',
          background: 'linear-gradient(to right, rgba(15, 15, 15, 0.95), rgba(15, 15, 15, 0.7), rgba(15, 15, 15, 0))',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: '80px',
          background: 'linear-gradient(to left, rgba(15, 15, 15, 0.95), rgba(15, 15, 15, 0.7), rgba(15, 15, 15, 0))',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {title && (
        <Box
          sx={{
            maxWidth: "lg",
            mx: "auto",
            px: 3,
            mb: { xs: 6, md: 8 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 600,
                mb: 4,
                textAlign: "center",
                color: 'text.primary'
              }}
            >
              {title}
            </Typography>
          </motion.div>
        </Box>
      )}

      {/* Multiple infinite scrolling rows */}
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        
        <Box
          sx={{
            // Animations for left-to-right and right-to-left
            '@keyframes scrollRTL': {
              from: { transform: 'translateX(0%)' },
              to: { transform: 'translateX(-50%)' }, // Move by half since we duplicate
            },
            '@keyframes scrollLTR': {
              from: { transform: 'translateX(-50%)' },
              to: { transform: 'translateX(0%)' }, // Move by half since we duplicate
            },
          }}
        >
        {technologies.map((tech, rowIndex) => {
          const direction = rowIndex % 2 === 0 ? 'scrollRTL' : 'scrollLTR';
          const duration = 60 + (rowIndex * 10); // Much slower - 60-120 seconds
          
          // Calculate layout based on current screen width and tech name
          const layout = calculateItemLayout(tech.name);
          const { totalItems, highlightSpacing } = layout;
          
          // Generate random starting offset for this row (consistent per row, different between rows)
          const randomStartOffset = (rowIndex * 7 + 3) % highlightSpacing; // Pseudo-random but consistent
          
          return (
            <Box
              key={`row-${rowIndex}-${screenWidth}`} // Include screenWidth to force re-render on resize
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, md: 4 }, // Reduced gap
                width: 'fit-content',
                mb: { xs: 1, md: 2 },
                minHeight: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' }, // Reduced heights
                opacity: isRevealed ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
                transitionDelay: `${rowIndex * 0.1}s`,
                ...(isRevealed && !prefersReducedMotion && {
                  animation: `${direction} ${duration}s linear infinite`,
                }),
              }}
            >
              {/* Create duplicated items for seamless loop */}
              {Array.from({ length: totalItems * 2 }, (_, itemIndex) => {
                const actualIndex = itemIndex % totalItems;
                // Highlight items based on calculated spacing with random offset
                const isHighlighted = (actualIndex + randomStartOffset) % highlightSpacing === 0;
                
                return (
                  <React.Fragment key={itemIndex}>
                    <Typography
                      sx={{
                        fontSize: { 
                          xs: isHighlighted ? '3rem' : '2.5rem',
                          sm: isHighlighted ? '4rem' : '3.5rem',
                          md: isHighlighted ? '5rem' : '4.5rem',
                          lg: isHighlighted ? '6rem' : '5.5rem'
                        },
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        color: isHighlighted ? (tech.color || 'text.primary') : 'text.secondary',
                        opacity: isHighlighted ? 1 : 0.15,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        textShadow: isHighlighted ? `0 0 20px ${tech.color || 'currentColor'}60` : 'none',
                        transition: 'all 0.3s ease',
                        ...(isHighlighted && {
                          filter: 'brightness(1.2)',
                          position: 'relative',
                          zIndex: 1,
                        }),
                      }}
                    >
                      {tech.name}
                    </Typography>
                    
                    {/* Separator dot */}
                    <Box
                      sx={{
                        width: { xs: '6px', md: '8px' },
                        height: { xs: '6px', md: '8px' },
                        borderRadius: '50%',
                        backgroundColor: 'text.secondary',
                        opacity: isHighlighted ? 0.5 : 0.1,
                        flexShrink: 0,
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </Box>
          );
        })}
        </Box>
      </Box>
    </Box>
  );
};

export default TechList;