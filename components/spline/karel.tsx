'use client';

import Spline from '@splinetool/react-spline';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

function SplineLoader() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        width: '100%'
      }}
    >
      <CircularProgress 
        sx={{ 
          color: 'secondary.main' 
        }} 
      />
    </Box>
  );
}

export default function KarelSignature() {
    return (
        <Suspense fallback={<SplineLoader />}>
            <Spline
                scene="https://prod.spline.design/Ro8ARKPyG3s59UCW/scene.splinecode"
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </Suspense>
    );
}
