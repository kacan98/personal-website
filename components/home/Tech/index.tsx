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
      // create as many GSAP animations and/or ScrollTriggers here as you want...
      const tl = gsap.timeline({
        scrollTrigger: {
          pin: true, // pin the trigger element while active
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Reduced from 4 to 1 for smoother response
          anticipatePin: 1, // Helps with smoother pin initialization
        },
      });

      tl.fromTo(
        ".tech-row",
        {
          x: (index) => {
            return index % 2 === 0
              ? gsap.utils.random(400, 300)
              : gsap.utils.random(-400, -300);
          },
          force3D: true, // Force 3D transforms for hardware acceleration
        },
        {
          x: (index) => {
            return index % 2 === 0
              ? gsap.utils.random(-400, -300)
              : gsap.utils.random(400, 300);
          },
          ease: "power2.inOut", // Smoother easing function
          force3D: true, // Force 3D transforms for hardware acceleration
        },
      );
    }, component);
    return () => ctx.revert(); // cleanup!
  }, []);
  return (
    <Box
      component="section"
      ref={component}
      sx={{
        overflow: "hidden",
        py: 4,
        willChange: "transform", // Add GPU acceleration hint
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
      </Box>      {technologies.map(({ name, color }, index) => (
        <Box
          key={index}
          className="tech-row"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            color: "text.secondary",
            willChange: "transform", // Add GPU acceleration hint
            transform: "translateZ(0)", // Force GPU acceleration
          }}
          aria-label={name || ""}
        >
          {Array.from({ length: 15 }, (_, itemIndex) => (
            <React.Fragment key={itemIndex}>
              <Typography
                className="tech-item"
                sx={{
                  fontSize: { xs: "3rem", md: "5rem", lg: "6rem" },
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "-0.05em",
                  color: itemIndex === 7 && color ? color : "inherit",
                  opacity: itemIndex === 7 ? 1 : 0.1,
                  textShadow: "0 0 1px currentColor",
                  WebkitTextStroke: "0.5px currentColor",
                }}
              >
                {name}
              </Typography>              <Box
                component="span"
                sx={{
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  display: "flex",
                  alignItems: "center",
                  opacity: 0.1, // All dots should be low opacity
                }}
              >
                <MdCircle />
              </Box>
            </React.Fragment>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default TechList;
