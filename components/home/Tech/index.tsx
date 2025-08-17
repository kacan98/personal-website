"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdCircle } from "react-icons/md";
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

const TechList = ({ title, technologies }: TechListProps): JSX.Element => {
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Reveal and start animation once when component comes into view
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
        py: { xs: 2, md: 4 },
        width: "100%",
      }}
    >
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          px: 3,
          mb: 4,
        }}
      >
        {title && (
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
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
                mb: 4,
                textAlign: "center",
              }}
            >
              {title}
            </Typography>
          </motion.div>
        )}
      </Box>

      <Box
        sx={{
          // CSS animations defined here - smaller range to keep center visible
          '@keyframes slideLeft': {
            '0%': { transform: 'translateX(150px)' },
            '25%': { transform: 'translateX(0px)' },
            '50%': { transform: 'translateX(-150px)' },
            '75%': { transform: 'translateX(0px)' },
            '100%': { transform: 'translateX(150px)' },
          },
          '@keyframes slideRight': {
            '0%': { transform: 'translateX(-150px)' },
            '25%': { transform: 'translateX(0px)' },
            '50%': { transform: 'translateX(150px)' },
            '75%': { transform: 'translateX(0px)' },
            '100%': { transform: 'translateX(-150px)' },
          },
          '@keyframes rotate': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
        }}
      >
        {technologies.map(({ name, color }, index) => {
          const totalItems = 15;
          const centerIndex = Math.floor(totalItems / 2);
          const direction = index % 2 === 0 ? 'slideRight' : 'slideLeft';
          
          return (
            <Box
              key={index}
              sx={{
                mb: { xs: 1, md: 2 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: { xs: 1, md: 2 },
                color: "text.secondary",
                width: "100%",
                position: "relative",
                minHeight: { xs: "4rem", sm: "5rem", md: "7rem", lg: "8rem" },
                // Hidden until revealed, then always animate
                opacity: isRevealed ? 1 : 0,
                transition: 'opacity 0.6s ease-in-out',
                transitionDelay: `${index * 0.1}s`,
                // Always animate once revealed (unless reduced motion)
                ...(isRevealed && !prefersReducedMotion && {
                  animation: `${direction} 25s ease-in-out infinite`,
                  animationDelay: `${index * 0.1}s`,
                }),
              }}
              aria-label={name || ""}
            >
              {Array.from({ length: totalItems }, (_, itemIndex) => {
                const isCenter = itemIndex === centerIndex;
                
                return (
                  <React.Fragment key={itemIndex}>
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: isCenter ? 10 : 1,
                      }}
                    >
                      <Typography
                        className="tech-item"
                        sx={{
                          fontSize: { 
                            xs: isCenter ? "3rem" : "2.5rem", 
                            sm: isCenter ? "4rem" : "3.5rem", 
                            md: isCenter ? "5.5rem" : "5rem", 
                            lg: isCenter ? "6.5rem" : "6rem" 
                          },
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "-0.05em",
                          color: isCenter ? (color || "inherit") : "inherit",
                          opacity: isCenter ? 1 : 0.1,
                          textShadow: "0 0 1px currentColor",
                          WebkitTextStroke: "0.5px currentColor",
                          ...(isCenter && {
                            position: "relative",
                            zIndex: 10,
                            filter: "brightness(1.2)",
                            textShadow: `0 0 20px ${color || "currentColor"}`,
                          }),
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {name}
                      </Typography>
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                        display: "flex",
                        alignItems: "center",
                        opacity: isCenter || itemIndex === centerIndex - 1 ? 0.3 : 0.1,
                        flexShrink: 0,
                        color: "inherit",
                        // CSS animation for rotation instead of Framer Motion
                        ...(isRevealed && !prefersReducedMotion && (isCenter || itemIndex === centerIndex - 1) && {
                          animation: 'rotate 10s linear infinite',
                        }),
                      }}
                    >
                      <MdCircle />
                    </Box>
                  </React.Fragment>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default TechList;