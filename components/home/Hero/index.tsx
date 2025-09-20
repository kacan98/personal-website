"use client";
import { Box, Grid, Typography, styled } from "@mui/material";
import React, { useRef } from "react";
import { BRAND_COLORS } from "@/app/colors";
import StaticShapes from "./StaticShapes";

interface HeroProps {
  firstName: string;
  lastName: string;
  tagLine: string;
}

const FirstNameContainer = styled(Typography)(({
  display: 'block',
  letterSpacing: '-0.02em',
  color: BRAND_COLORS.primary,
  marginBottom: '0.5rem',
  fontSize: 'clamp(3rem, 8vw, 5rem)',
  fontWeight: 600,
  fontDisplay: 'swap',
}));

const LastNameContainer = styled(Typography)(({
  display: 'block',
  color: BRAND_COLORS.primary,
  marginTop: '0.5rem',
  letterSpacing: '-0.02em',
  fontSize: 'clamp(3rem, 8vw, 5rem)',
  fontWeight: 700,
  fontDisplay: 'swap',
}));

const JobTitle = styled(Typography)({
  display: 'block',
  color: BRAND_COLORS.secondary,
  textTransform: 'none',
  letterSpacing: '0.02em',
  fontWeight: 500,
  fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
  marginTop: '1rem',
  contain: 'layout style',
  minHeight: '2rem',
});

const NameHeading = styled(Typography)(({
  marginBottom: '1.5rem',
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  contain: 'layout style',
  minHeight: '6rem',
}));

export const Hero = ({ firstName, lastName, tagLine }: HeroProps) => {
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
            minHeight: '70vh',
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
