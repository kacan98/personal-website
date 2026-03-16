import React from 'react';
import { Typography, Box } from '@mui/material';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  align = 'center',
  size = 'medium',
  className,
  onClick
}) => {
  const getSizeSx = () => {
    switch (size) {
      case 'small':
        return { fontSize: { xs: '1.5rem', md: '2rem' } };
      case 'large':
        return { fontSize: { xs: '2.5rem', md: '3rem' } };
      default: // medium
        return { fontSize: { xs: '2rem', md: '2.5rem' } };
    }
  };

  return (
    <Box 
      className={className}
      sx={{ 
        textAlign: align,
        mb: { xs: 4, md: 6 }
      }}
    >
      {subtitle && (
        <Typography
          component="div"
          sx={{
            fontFamily: 'ui-monospace, "SFMono-Regular", "SF Mono", Consolas, monospace',
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'text.secondary',
            mb: 1.25,
          }}
        >
          {subtitle}
        </Typography>
      )}
      <Typography 
        variant="h2"
        component="h2"
        onClick={onClick}
        sx={{
          ...getSizeSx(),
          fontWeight: 700,
          color: 'text.primary',
          letterSpacing: '-0.035em',
          lineHeight: 1.02,
          mb: description ? 2.25 : 0,
          cursor: 'default',
        }}
      >
        {title}
      </Typography>
      
      {description && (
        <Typography 
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.05rem' },
            color: 'text.secondary',
            maxWidth: '600px',
            mx: align === 'center' ? 'auto' : 0,
            lineHeight: 1.75,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default SectionHeader;
