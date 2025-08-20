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
  letterSpacing: '0.001em',
  color: '#64748b',
  marginBottom: '0.7rem',
  fontSize: 'clamp(2rem, 8vw, 5rem)',
  fontDisplay: 'swap', // Improve font loading performance
}));

const LastNameContainer = styled(Typography)(({
  display: 'block',
  color: '#cbd5e1',
  marginTop: '16px',
  letterSpacing: '0.001em',
  whiteSpace: 'nowrap',
  fontSize: 'clamp(3rem, 10vw, 6rem)',
  fontDisplay: 'swap', // Improve font loading performance
}));

const JobTitle = styled(Typography)({
  display: 'block',
  background: `linear-gradient(to right top, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary}, ${BRAND_COLORS.primary})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  fontWeight: 700,
  contain: 'layout style',
  minHeight: '2.5rem', // Prevent layout shift
});

const NameHeading = styled(Typography)(({
  marginBottom: '2rem',
  fontWeight: 800,
  lineHeight: 0.9,
  letterSpacing: '-0.05em',
  contain: 'layout style',
  minHeight: '8rem', // Prevent layout shift for large text
}));

export const Hero = ({ firstName, lastName, tagLine }: HeroProps): JSX.Element => {
  const component = useRef(null);

  // Simplified rendering for better LCP performance
  const renderOptimizedText = (name: string) => {
    return name;
  };

  return (
    <Box ref={component}>
        <Grid
          container
          sx={{
            minHeight: '70vh',
            alignItems: 'center',
            flexDirection: { l: 'column-reverse', xl: 'row' }
          }}
        >
          <Grid item xs={12} md={6}>
            <Box className="hero-text" sx={{ data: { speed: 0.2 } }}>
              <NameHeading variant="h1" aria-label={firstName + " " + lastName}>
                <FirstNameContainer className="name-container" variant="inherit">
                  {renderOptimizedText(firstName)}
                </FirstNameContainer>
                <LastNameContainer className="name-container" variant="inherit">
                  {renderOptimizedText(lastName)}
                </LastNameContainer>
              </NameHeading>
              <JobTitle className="job-title" variant="h2" sx={{
                fontSize: { xs: '1.5rem', md: '2.25rem' }
              }}>
                {tagLine}
              </JobTitle>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{
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
