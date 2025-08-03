"use client";

import { Box, Typography } from "@mui/material";

export interface CenteredSection {
  header: string;
  content: string;
  visual?: React.ReactNode; // Optional visual element for the section
}

interface CenteredSectionsProps {
  sections: CenteredSection[];
  title?: string;
}

// Individual section component to avoid hooks in callbacks
function CenteredSectionItem({ section }: { section: CenteredSection; index: number }) {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: { xs: 6, md: 10 }
      }}
    >
      <Box sx={{ 
        textAlign: 'center', 
        maxWidth: '800px',
        px: { xs: 2, md: 0 }
      }}>
        <Typography 
          variant="h2" 
          component="h2"
          sx={{ 
            mb: 4,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: { xs: '3rem', md: '4rem' }
          }}
        >
          {section.header}
        </Typography>
        
        {section.visual && (
          <Box sx={{ 
            mb: 4, 
            height: { xs: '250px', md: '300px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {section.visual}
          </Box>
        )}
        
        <Typography 
          variant="h5" 
          component="div"
          sx={{ 
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.8,
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            fontWeight: 300,
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          {section.content}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CenteredSections({ sections, title }: CenteredSectionsProps) {
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
      
      {sections.map((section, index) => (
        <CenteredSectionItem key={section.header} section={section} index={index} />
      ))}
    </Box>
  );
}