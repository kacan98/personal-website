"use client";
import { Box, Grid, Typography, styled } from "@mui/material";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Shapes } from "./Shapes";

interface HeroProps {
  firstName: string;
  lastName: string;
  tagLine: string;
}

// Styled components
const NameLetter = styled('span')({
  display: 'inline-block',
  opacity: 0,
});

const FirstNameContainer = styled(Typography)({
  display: 'block',
  color: '#64748b', // text-slate-500 equivalent
});

const LastNameContainer = styled(Typography)({
  display: 'block',
  color: '#cbd5e1', // text-slate-300 equivalent
  marginTop: '-0.2em',
});

const JobTitle = styled(Typography)({
  display: 'block',
  background: 'linear-gradient(to right top, #f59e0b, #fde68a, #f59e0b)', // from-yellow-500 via-yellow-200 to-yellow-500
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  fontWeight: 700,
  opacity: 0,
});

const NameHeading = styled(Typography)({
  marginBottom: '2rem',
  fontSize: 'clamp(3rem, 20vmin, 20rem)',
  fontWeight: 800,
  lineHeight: 'none',
  letterSpacing: '-0.05em',
});

/**
 * Component for "Hero" Slices.
 */
export const Hero = ({ firstName, lastName, tagLine }: HeroProps): JSX.Element => {
  const component = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // create as many GSAP animations and/or ScrollTriggers here as you want...
      gsap
        .timeline()
        .fromTo(
          ".name-animation",
          { x: -100, opacity: 0, rotate: -10 },
          {
            x: 0,
            opacity: 1,
            rotate: 0,
            ease: "elastic.out(1,0.3)",
            duration: 1,
            transformOrigin: "left top",
            stagger: { each: 0.1, from: "random" },
          },
        )
        .fromTo(
          ".job-title",
          {
            y: 20,
            opacity: 0,
            scale: 1.2,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scale: 1,
            ease: "elastic.out(1,0.3)",
          },
        );
    }, component);
    return () => ctx.revert(); // cleanup!
  }, []);

  const renderLetters = (name: string, key: string) => {
    if (!name) return;
    return name.split("").map((letter, index) => (
      <NameLetter
        key={index}
        className={`name-animation name-animation-${key}-index`}
      >
        {letter}
      </NameLetter>
    ));
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
          <Box sx={{ data: { speed: 0.2 } }}>
            <NameHeading variant="h1" aria-label={firstName + " " + lastName}>
              <FirstNameContainer variant="inherit">
                {renderLetters(firstName, "first")}
              </FirstNameContainer>
              <LastNameContainer variant="inherit">
                {renderLetters(lastName, "last")}
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
          justifyContent: 'center'
        }}>
          <Shapes />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Hero;
