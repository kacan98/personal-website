"use client";
import { Box, Grid, Typography, styled } from "@mui/material";
import { useRef } from "react";
import StaticShapes from "./StaticShapes";

interface HeroProps {
  firstName: string;
  lastName: string;
  tagLine: string;
}

const NameLetter = styled('span')({
  display: 'inline-block',
  willChange: 'transform, opacity',
});

const FirstNameContainer = styled(Typography)(({
  display: 'block',
  letterSpacing: '0.001em',
  color: '#64748b',
  marginBottom: '0.7rem',
  fontSize: 'clamp(2rem, 100%, 20vw)',
}));

const LastNameContainer = styled(Typography)(({
  display: 'block',
  color: '#cbd5e1',
  marginTop: '16px',
  letterSpacing: '0.001em',
  whiteSpace: 'nowrap',
  fontSize: 'clamp(3rem, 100%, 20vw)'
}));

const JobTitle = styled(Typography)({
  display: 'block',
  background: 'linear-gradient(to right top, #f59e0b, #fde68a, #f59e0b)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  fontWeight: 700,
  willChange: 'transform, opacity',
});

const NameHeading = styled(Typography)(({
  marginBottom: '2rem',
  fontWeight: 800,
  lineHeight: 0.9,
  letterSpacing: '-0.05em',
}));

export const Hero = ({ firstName, lastName, tagLine }: HeroProps): JSX.Element => {
  const component = useRef(null);

  const renderLetters = (name: string, key: string) => {
    if (!name) return;
    return name.split("").map((letter, index) => (
      <NameLetter
        key={index}
        className={`name-animation name-animation-${key}-${index}`}
      >
        {letter === " " ? "\u00A0" : letter}
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
