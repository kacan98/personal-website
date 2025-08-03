import Spline from '@splinetool/react-spline/next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

function SplineLoader() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        width: '100%'
      }}
    >
      <CircularProgress 
        sx={{ 
          color: '#f59e0b' 
        }} 
      />
    </Box>
  );
}

export default function ThreeDeeLaptop() {
    return (
        <Suspense fallback={<SplineLoader />}>
            <Spline
                scene="https://prod.spline.design/CKHWYHYZO5Icx-vv/scene.splinecode"
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </Suspense>
    );
}
