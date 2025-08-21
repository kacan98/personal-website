'use client';

import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';

const ThreeDLaptop = dynamic(() => import("./laptop"), {
  ssr: false,
  loading: () => (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '300px',
      width: '100%'
    }}>
      <Typography>Loading 3D Model...</Typography>
    </Box>
  )
});

export default function SplineWrapper() {
  return <ThreeDLaptop />;
}