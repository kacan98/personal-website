"use client";

import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

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

// Individual timeline item component to avoid hooks in callbacks
function TimelineItemComponent({ item, index }: { item: TimelineItem; index: number }) {
  return (
    <Box 
      sx={{ 
        position: 'relative',
        mb: { xs: 6, md: 8 },
        pl: { xs: 6, md: 0 }
      }}>
      {/* Timeline dot */}
      <Box sx={{
        position: 'absolute',
        left: { xs: '11px', md: '50%' },
        top: '20px',
        width: '20px',
        height: '20px',
        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        borderRadius: '50%',
        transform: { xs: 'none', md: 'translateX(-50%)' },
        zIndex: 2,
        boxShadow: '0 0 0 4px rgba(15, 23, 42, 1)'
      }} />
      
      <Grid2 container spacing={4} alignItems="center">
        <Grid2 xs={12} md={6} sx={{ 
          order: { xs: 1, md: index % 2 === 0 ? 1 : 2 },
          textAlign: { xs: 'left', md: index % 2 === 0 ? 'right' : 'left' }
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
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
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
                background: 'rgba(245, 158, 11, 0.2)',
                borderRadius: 2,
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'inline-block'
              }}>
                <Typography 
                  variant="body2" 
                  component="span"
                  sx={{ 
                    color: '#fbbf24',
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
                      color: '#f59e0b',
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
        </Grid2>
        
        <Grid2 xs={12} md={6} sx={{ 
          order: { xs: 2, md: index % 2 === 0 ? 2 : 1 }
        }}>
          <Box sx={{ 
            height: '250px',
            background: `rgba(${(index + 1) * 60 + 100}, ${200 - index * 30}, ${255 - index * 40}, 0.1)`,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid rgba(${(index + 1) * 60 + 100}, ${200 - index * 30}, ${255 - index * 40}, 0.2)`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            }
          }}>
            {item.visual || (
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)',
                  mb: 1
                }}>
                  {item.company}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                  {item.period}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default function Timeline({ items, title }: TimelineProps) {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      {title && (
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'center', 
            mb: 6, 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          {title}
        </Typography>
      )}
      
      <Box sx={{ position: 'relative', maxWidth: '1000px', mx: 'auto' }}>
        {/* Timeline line */}
        <Box sx={{
          position: 'absolute',
          left: { xs: '20px', md: '50%' },
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(180deg, #f59e0b, #fbbf24)',
          transform: { xs: 'none', md: 'translateX(-50%)' }
        }} />
        
        {items.map((item, index) => (
          <TimelineItemComponent key={`${item.company}-${index}`} item={item} index={index} />
        ))}
      </Box>
    </Box>
  );
}