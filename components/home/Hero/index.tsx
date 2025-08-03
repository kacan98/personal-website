"use client";
import { Box, Grid, Typography, styled } from "@mui/material";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ShapesSkeleton from "./ShapesSkeleton";

// Dynamic import with no SSR for better performance
const Shapes = dynamic(() => import("./Shapes").then(mod => ({ default: mod.Shapes })), {
  ssr: false,
  loading: () => null, // We handle loading with our skeleton
});

interface HeroProps {
  firstName: string;
  lastName: string;
  tagLine: string;
}

// Styled components
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

// Remove LoadingOverlay - we'll use inline skeleton instead

/**
 * Component for "Hero" Slices.
 */
export const Hero = ({ firstName, lastName, tagLine }: HeroProps): JSX.Element => {
  const component = useRef(null);
  const [loading, setLoading] = useState(true);
  const [startLoading3D, setStartLoading3D] = useState(false);

  // Start loading 3D shapes immediately but with minimal skeleton display
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartLoading3D(true);
    }, 200); // Reduced delay for faster perceived performance
    
    return () => clearTimeout(timer);
  }, []);

  // Handle real 3D loading progress - placeholder for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleProgressChange = useCallback((_progress: number) => {
    // Progress tracking removed for now
  }, []);

  // Handle real 3D loading completion
  const handleShapesLoaded = useCallback(() => {
    setLoading(false);
  }, []);  // Animation effect that runs after loading is complete
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
    );

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
            {/* Show skeleton while loading */}
            <Box
              sx={{
                position: loading ? 'static' : 'absolute',
                opacity: loading ? 1 : 0,
                transition: 'opacity 0.5s ease',
                zIndex: loading ? 1 : 0,
                width: '100%'
              }}
            >
              <ShapesSkeleton />
            </Box>
            
            {/* Show 3D shapes when loaded - only render after startLoading3D is true */}
            {startLoading3D && (
              <Box
                sx={{
                  position: loading ? 'absolute' : 'static',
                  opacity: loading ? 0 : 1,
                  transition: 'opacity 0.8s ease',
                  zIndex: loading ? 0 : 1,
                  width: '100%'
                }}
              >
                <Shapes 
                  onLoadingComplete={handleShapesLoaded}
                  onProgressChange={handleProgressChange}
                />
              </Box>
            )}
          </Grid>
        </Grid>
    </Box>
  );
};

export default Hero;
