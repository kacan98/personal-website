'use client';

import { AutoAwesome, Psychology, Group } from "@mui/icons-material";
import ThreeDLaptop from "@/components/spline/laptop";

interface AboutVisualProps {
  type: 'laptop' | 'ai' | 'problem' | 'user';
}

export default function AboutVisual({ type }: AboutVisualProps) {
  switch(type) {
    case 'laptop':
      return <ThreeDLaptop />;
    case 'ai':
      return (
        <AutoAwesome 
          sx={{ 
            fontSize: { xs: '80px', md: '120px' },
            color: '#a855f7',
            filter: 'drop-shadow(0 4px 8px rgba(168, 85, 247, 0.3))'
          }} 
        />
      );
    case 'problem':
      return (
        <Psychology 
          sx={{ 
            fontSize: { xs: '80px', md: '120px' },
            color: '#06b6d4',
            filter: 'drop-shadow(0 4px 8px rgba(6, 182, 212, 0.3))'
          }} 
        />
      );
    case 'user':
      return (
        <Group 
          sx={{ 
            fontSize: { xs: '80px', md: '120px' },
            color: '#10b981',
            filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3))'
          }} 
        />
      );
    default:
      return null;
  }
}