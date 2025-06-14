"use client";
import { Box, Grid, Typography, styled } from "@mui/material";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
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
  willChange: 'transform, opacity',
});

const FirstNameContainer = styled(Typography)(({
  display: 'block',
  letterSpacing: '0.001em',
  color: '#64748b',
  marginBottom: '0.7rem',
  fontSize: 'clamp(2rem, 100%, 11rem)',
}));

const LastNameContainer = styled(Typography)(({
  display: 'block',
  color: '#cbd5e1',
  marginTop: '16px',
  letterSpacing: '0.001em',
  whiteSpace: 'nowrap',
  fontSize: 'clamp(3rem, 100%, 6rem)'
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
  opacity: 0,
  willChange: 'transform, opacity',
});

const NameHeading = styled(Typography)(({
  marginBottom: '2rem',
  fontWeight: 800,
  lineHeight: 0.9,
  letterSpacing: '-0.05em',
}));

// Loading overlay styled component
const LoadingOverlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#0f172a',
  zIndex: 9999,
  transition: 'opacity 0.4s ease-out',
});

/**
 * Component for "Hero" Slices.
 */
export const Hero = ({ firstName, lastName, tagLine }: HeroProps): JSX.Element => {
  const component = useRef(null);
  const [showShapes, setShowShapes] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simple loading simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          const next = prev + 30;
          if (next >= 100) {
            clearInterval(interval);
            // Once loading reaches 100%, wait a bit and hide the loader
            setTimeout(() => setLoading(false), 100);
            return 100;
          }
          return next;
        });
      }, 50);
    }

    return () => clearInterval(interval);
  }, [loading]);
  // Animation effect that runs after loading is complete
  useEffect(() => {
    if (loading || !component.current) return;

    // Create animation timeline
    const tl = gsap.timeline();

    // Animate letters
    tl.fromTo(
      ".name-animation",
      { y: -15, opacity: 0, scale: 0.9 },
      { 
        y: 0,
        opacity: 1, 
        scale: 1,
        duration: 0.4,
        stagger: 0.02,
        ease: "back.out(1.2)",
      }
    )
      .fromTo(
        ".job-title",
        { y: 5, opacity: 0 },
        { 
        y: 0,
        opacity: 1, 
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .call(() => setShowShapes(true));

    return () => {
      tl.kill();
    };
  }, [loading]);

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
    <>
      {loading && (
        <LoadingOverlay>
          <Box sx={{ width: '60%', maxWidth: '400px', mb: 2 }}>
            <Box
              sx={{
                height: '8px',
                width: `${loadingProgress}%`,
                bgcolor: '#f59e0b',
                borderRadius: '4px',
                background: 'linear-gradient(to right, #f59e0b, #fde68a, #f59e0b)',
                transition: 'width 0.3s ease'
              }}
            />
          </Box>
          <Typography
            sx={{
              color: '#cbd5e1',
              letterSpacing: '0.1em',
              mt: 1.5
            }}
          >
            Preparing portfolio experience...
          </Typography>
        </LoadingOverlay>
      )}

      <Box ref={component} sx={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
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
            {showShapes && <Shapes />}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Hero;
