"use client";
import { Box, Typography, styled } from "@mui/material";
import React, { useRef } from "react";
import { BRAND_COLORS } from "@/app/colors";
import StaticShapes from "./StaticShapes";
import { motion, useReducedMotion } from "motion/react";

interface HeroProps {
  firstName: string;
  lastName: string;
  tagLine: string;
  subtitle?: string;
}

const FirstNameContainer = styled("span")(({
  display: 'block',
  letterSpacing: '-0.04em',
  color: BRAND_COLORS.primary,
  marginBottom: '0.25rem',
  fontSize: 'clamp(3.2rem, 8vw, 5.4rem)',
  fontWeight: 700,
}));

const LastNameContainer = styled("span")(({
  display: 'block',
  color: BRAND_COLORS.primary,
  marginTop: '0.1rem',
  letterSpacing: '-0.045em',
  fontSize: 'clamp(3.2rem, 8vw, 5.4rem)',
  fontWeight: 700,
}));

const JobTitle = styled(Typography)({
  display: 'block',
  color: 'rgba(255, 255, 255, 0.88)',
  textTransform: 'none',
  letterSpacing: '-0.01em',
  fontWeight: 600,
  fontSize: 'clamp(1.35rem, 4vw, 1.85rem)',
  marginTop: '1.2rem',
  contain: 'layout style',
  minHeight: '2rem',
});

const JobSubtitle = styled(Typography)({
  display: 'block',
  color: 'rgba(255, 255, 255, 0.74)',
  fontWeight: 400,
  lineHeight: 1.75,
  fontSize: 'clamp(1rem, 2vw, 1.08rem)',
  marginTop: '1.1rem',
  maxWidth: '36rem',
});

const NameHeading = styled("h1")(({ 
  marginBottom: '1.5rem',
  fontWeight: 700,
  lineHeight: 0.96,
  letterSpacing: '-0.03em',
  contain: 'layout style',
  minHeight: '6rem',
  marginTop: 0,
}));

const AnimatedNameHeading = motion(NameHeading);
const AnimatedJobTitle = motion(JobTitle);
const AnimatedSubtitle = motion(JobSubtitle);

export const Hero = ({ firstName, lastName, tagLine, subtitle }: HeroProps) => {
  const component = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Simplified rendering for better LCP performance
  const renderOptimizedText = (name: string) => {
    return name;
  };

  const heroTextMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
      };

  const namePartsMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, delay: 0.12 },
      };

  const shapesMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.9, delay: 0.18 },
      };

  return (
    <Box ref={component}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
          minHeight: '64vh',
          alignItems: 'center',
        }}
      >
        <motion.div {...heroTextMotion}>{ }
          <Box
            className="hero-text"
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              px: { xs: 2, sm: 3, md: 0 },
              width: '100%',
              maxWidth: { xs: 420, md: 'none' },
              mx: { xs: 'auto', md: 0 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
            }}
          >
            <AnimatedNameHeading aria-label={firstName + ' ' + lastName} {...namePartsMotion}>
              <FirstNameContainer className="name-container" style={{ textAlign: 'inherit' }}>
                {renderOptimizedText(firstName)}
              </FirstNameContainer>
              <LastNameContainer className="name-container" style={{ textAlign: 'inherit' }}>
                {renderOptimizedText(lastName)}
              </LastNameContainer>
            </AnimatedNameHeading>
            <AnimatedJobTitle className="job-title" variant="h3" {...namePartsMotion}>
              {tagLine}
            </AnimatedJobTitle>
            {subtitle ? (
              <AnimatedSubtitle variant="body1" {...namePartsMotion}>
                {subtitle}
              </AnimatedSubtitle>
            ) : null}
          </Box>
        </motion.div>
        <motion.div {...shapesMotion}>{ }
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <StaticShapes />
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Hero;
