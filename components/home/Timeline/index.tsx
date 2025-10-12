"use client";

import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { BRAND_COLORS, BRAND_GRADIENTS } from "@/app/colors";
import { useState, useEffect, useRef } from "react";

export interface TimelineItem {
  title: string;
  company: string;
  period: string;
  description: string[];
  visual?: React.ReactNode; // Optional visual element
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
}

// Individual timeline item component with slide-in animation
function TimelineItemComponent({ item, index }: { item: TimelineItem; index: number }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRevealed) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isRevealed) {
          setIsRevealed(true);
        }
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, [isRevealed]);

  return (
    <Box
      ref={itemRef}
      sx={{
        position: 'relative',
        mb: { xs: 6, md: 8 },
        pl: { xs: 6, md: 0 },
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        transitionDelay: `${index * 0.2}s`,
      }}>
      {/* Timeline dot */}
      <Box sx={{
        position: 'absolute',
        left: { xs: '11px', md: '50%' },
        top: '20px',
        width: '20px',
        height: '20px',
        background: BRAND_GRADIENTS.primary,
        borderRadius: '50%',
        transform: { xs: 'none', md: 'translateX(-50%)' },
        zIndex: 2,
        boxShadow: '0 0 0 4px rgba(15, 23, 42, 1)'
      }} />
      <Grid container spacing={4} alignItems="center">
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            order: { xs: 1, md: index % 2 === 0 ? 1 : 2 },
            textAlign: 'left'
          }}>
          <Box sx={{ 
            p: 4, 
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }
          }}>
            <Typography 
              variant="h5" 
              component="h3"
              sx={{ 
                mb: 1,
                fontWeight: 600,
                background: BRAND_GRADIENTS.primary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '1.3rem', md: '1.6rem' }
              }}
            >
              {item.title}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 },
              mb: 2,
              alignItems: { xs: 'flex-start', sm: 'center' }
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 500,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                {item.company}
              </Typography>
              <Box sx={{
                px: 2,
                py: 0.5,
                background: `rgba(${BRAND_COLORS.accentRgb}, 0.2)`,
                borderRadius: 2,
                border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.3)`,
                display: 'inline-block'
              }}>
                <Typography 
                  variant="body2" 
                  component="span"
                  sx={{ 
                    color: 'secondary.light',
                    fontWeight: 500,
                    fontSize: '0.85rem'
                  }}
                >
                  {item.period}
                </Typography>
              </Box>
            </Box>
            
            <Box component="ul" sx={{ 
              margin: 0, 
              paddingLeft: 2,
              listStyle: 'none'
            }}>
              {item.description.map((desc, descIndex) => (
                <Box 
                  key={descIndex}
                  component="li" 
                  sx={{ 
                    position: 'relative',
                    mb: 1,
                    pl: 2,
                    '&::before': {
                      content: '"•"',
                      position: 'absolute',
                      left: 0,
                      color: 'secondary.main',
                      fontWeight: 'bold'
                    }
                  }}
                >
                  <Typography 
                    variant="body1" 
                    component="span"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.95rem', md: '1rem' }
                    }}
                  >
                    {desc.replace(/^-\s*/, '')} {/* Remove leading dash if present */}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Empty decorative column - no duplicate content */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            order: { xs: 2, md: index % 2 === 0 ? 2 : 1 },
            display: { xs: 'none', md: 'block' }
          }}>
          {/* Optional: Could add item.visual here if provided */}
          {item.visual && (
            <Box sx={{
              height: '250px',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {item.visual}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default function Timeline({ items, title }: TimelineProps) {
  const [isTitleRevealed, setIsTitleRevealed] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTitleRevealed) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTitleRevealed) {
          setIsTitleRevealed(true);
        }
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, [isTitleRevealed]);

  return (
    <Box sx={{ 
      py: { xs: 6, md: 8 }, // Increased margins above and below
      mt: { xs: 4, md: 6 },  // Additional top margin
      mb: { xs: 4, md: 6 }   // Additional bottom margin
    }}>
      {title && (
        <Box ref={titleRef}>
          <Typography 
            variant="h2" 
            component="h2"
            sx={{ 
              textAlign: 'center', 
              mb: 6, 
              fontWeight: 600,
              background: BRAND_GRADIENTS.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: { xs: '2rem', md: '2.5rem' },
              opacity: isTitleRevealed ? 1 : 0,
              transform: isTitleRevealed ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
      
      <Box sx={{ position: 'relative', maxWidth: '1000px', mx: 'auto' }}>
        {/* Timeline line */}
        <Box sx={{
          position: 'absolute',
          left: { xs: '20px', md: '50%' },
          top: 0,
          bottom: 0,
          width: '2px',
          background: `linear-gradient(180deg, ${BRAND_COLORS.accent}, ${BRAND_COLORS.secondary})`,
          transform: { xs: 'none', md: 'translateX(-50%)' }
        }} />
        
        {items.map((item, index) => (
          <TimelineItemComponent key={`${item.company}-${index}`} item={item} index={index} />
        ))}
      </Box>
    </Box>
  );
}