"use client";

import React, { useLayoutEffect, useRef } from "react";
import { MdCircle } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Box, Typography } from "@mui/material";

gsap.registerPlugin(ScrollTrigger);

/**
 * Technology item interface
 */
export interface TechItem {
  name: string;
  color?: string;
}

/**
 * Props for `TechList`.
 */
export type TechListProps = {
  title?: string;
  technologies: TechItem[];
};

/**
 * Component for "TechList" Slices.
 */
const TechList = ({ title, technologies }: TechListProps): JSX.Element => {
  const component = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Simple scroll-based animation without pinning or sticking
      gsap.set(".tech-row", {
        x: (index) => {
          // Set initial positions
          const isMobile = window.innerWidth < 768;
          const baseRange = isMobile ? 200 : 400;
          const direction = index % 2 === 0 ? 1 : -1;
          return direction * gsap.utils.random(baseRange * 0.5, baseRange);
        },
      });

      // Create continuous scroll-based movement
      gsap.to(".tech-row", {
        x: (index) => {
          // Move to opposite positions as we scroll
          const isMobile = window.innerWidth < 768;
          const baseRange = isMobile ? 200 : 400;
          const direction = index % 2 === 0 ? -1 : 1;
          return direction * gsap.utils.random(baseRange * 0.5, baseRange);
        },
        ease: "none",
        scrollTrigger: {
          trigger: component.current,
          start: "top bottom", // Start when component enters viewport
          end: "bottom top",   // End when component leaves viewport
          scrub: 1, // Smooth scroll-tied animation
          // NO pinning - this was causing the sticky behavior
        },
      });
    }, component);
    return () => ctx.revert();
  }, []);
  return (
    <Box
      component="section"
      ref={component}
      sx={{
        overflow: "hidden",
        py: { xs: 2, md: 4 },
        width: "100%",
        // Remove any positioning that could cause sticking
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
        )}
      </Box>      {technologies.map(({ name, color }, index) => {
        // Calculate the center index dynamically based on array length
        const totalItems = 15;
        const centerIndex = Math.floor(totalItems / 2); // This will be 7 for 15 items
        
        return (
          <Box
            key={index}
            className="tech-row"
            sx={{
              mb: { xs: 1, md: 2 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 1, md: 2 },
              color: "text.secondary",
              width: "100%",
              // Let GSAP handle the transform
            }}
            aria-label={name || ""}
          >
            {Array.from({ length: totalItems }, (_, itemIndex) => (
              <React.Fragment key={itemIndex}>
                <Typography
                  className="tech-item"
                  sx={{
                    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "5rem", lg: "6rem" },
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "-0.05em",
                    color: itemIndex === centerIndex && color ? color : "inherit",
                    opacity: itemIndex === centerIndex ? 1 : 0.1,
                    textShadow: "0 0 1px currentColor",
                    WebkitTextStroke: "0.5px currentColor",
                    // Ensure the highlighted word is more prominent and centered
                    ...(itemIndex === centerIndex && {
                      position: "relative",
                      zIndex: 1,
                      filter: "brightness(1.2)",
                      textShadow: `0 0 20px ${color || "currentColor"}`,
                    }),
                    // Ensure text doesn't break and stays on one line
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {name}
                </Typography>
                <Box
                  component="span"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" },
                    display: "flex",
                    alignItems: "center",
                    opacity: 0.1,
                    flexShrink: 0,
                  }}
                >
                  <MdCircle />
                </Box>
              </React.Fragment>
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default TechList;
