"use client";
import { Box, Grid, Typography, styled } from "@mui/material";
import React, { useRef } from "react";
import { BRAND_COLORS } from "@/app/colors";
import StaticShapes from "./StaticShapes";

interface HeroProps {
  firstName: string;
  lastName: string;
  tagLine: string;
  subtitle?: string;
}

const FirstNameContainer = styled(Typography)(({
  display: 'block',
  letterSpacing: '-0.04em',
  color: BRAND_COLORS.primary,
  marginBottom: '0.25rem',
  fontSize: 'clamp(3.2rem, 8vw, 5.4rem)',
  fontWeight: 700,
  fontDisplay: 'swap',
}));

const LastNameContainer = styled(Typography)(({
  display: 'block',
  color: BRAND_COLORS.primary,
  marginTop: '0.1rem',
  letterSpacing: '-0.045em',
  fontSize: 'clamp(3.2rem, 8vw, 5.4rem)',
  fontWeight: 700,
  fontDisplay: 'swap',
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

const NameHeading = styled(Typography)(({
  marginBottom: '1.5rem',
  fontWeight: 700,
  lineHeight: 0.96,
  letterSpacing: '-0.03em',
  contain: 'layout style',
  minHeight: '6rem',
}));

export const Hero = ({ firstName, lastName, tagLine, subtitle }: HeroProps) => {
  const component = useRef(null);

  // Simplified rendering for better LCP performance
  const renderOptimizedText = (name: string) => {
    return name;
  };

  return (
    <Box ref={component}>
        <Grid
          container
          spacing={2}
          sx={{
            minHeight: '64vh',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <Box className="hero-text" sx={{
              data: { speed: 0.2 },
              textAlign: { xs: 'center', md: 'left' },
              px: { xs: 2, sm: 3, md: 0 }
            }}>
              <NameHeading variant="h1" aria-label={firstName + " " + lastName}>
                <FirstNameContainer className="name-container" variant="inherit">
                  {renderOptimizedText(firstName)}
                </FirstNameContainer>
                <LastNameContainer className="name-container" variant="inherit">
                  {renderOptimizedText(lastName)}
                </LastNameContainer>
              </NameHeading>
              <JobTitle className="job-title" variant="h3">
                {tagLine}
              </JobTitle>
              {subtitle ? (
                <JobSubtitle variant="body1">
                  {subtitle}
                </JobSubtitle>
              ) : null}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <StaticShapes />
          </Grid>
        </Grid>
    </Box>
  );
};

export default Hero;
