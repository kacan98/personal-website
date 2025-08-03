"use client";

import { Box, Skeleton, styled } from "@mui/material";

const SkeletonContainer = styled(Box)(({ theme }) => ({
  aspectRatio: '1 / 1',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    marginTop: 0,
    marginBottom: 0,
  },
}));

const FloatingShape = styled(Box)(() => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))',
  border: '2px solid rgba(245, 158, 11, 0.2)',
  animation: 'float 3s ease-in-out infinite',
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px) rotate(0deg)',
    },
    '50%': {
      transform: 'translateY(-10px) rotate(180deg)',
    },
  },
}));

const PulsingShape = styled(Box)(() => ({
  borderRadius: '8px',
  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1))',
  border: '2px solid rgba(245, 158, 11, 0.2)',
  animation: 'pulse 2s ease-in-out infinite alternate',
  '@keyframes pulse': {
    '0%': {
      opacity: 0.3,
      transform: 'scale(0.95)',
    },
    '100%': {
      opacity: 0.7,
      transform: 'scale(1.05)',
    },
  },
}));

export default function ShapesSkeleton() {
  return (
    <SkeletonContainer>
      {/* Central large shape */}
      <FloatingShape
        sx={{
          width: '120px',
          height: '120px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animationDelay: '0s',
        }}
      />
      
      {/* Surrounding smaller shapes */}
      <FloatingShape
        sx={{
          width: '60px',
          height: '60px',
          top: '20%',
          left: '30%',
          animationDelay: '0.5s',
        }}
      />
      
      <PulsingShape
        sx={{
          width: '80px',
          height: '40px',
          top: '30%',
          right: '20%',
          animationDelay: '1s',
        }}
      />
      
      <FloatingShape
        sx={{
          width: '70px',
          height: '70px',
          bottom: '25%',
          left: '25%',
          animationDelay: '1.5s',
        }}
      />
      
      <PulsingShape
        sx={{
          width: '50px',
          height: '90px',
          bottom: '20%',
          right: '30%',
          animationDelay: '2s',
        }}
      />
      
      {/* Progress indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Skeleton
          variant="rectangular"
          width={200}
          height={4}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.4) 50%, rgba(245, 158, 11, 0.2) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
            '@keyframes shimmer': {
              '0%': {
                backgroundPosition: '-200% 0',
              },
              '100%': {
                backgroundPosition: '200% 0',
              },
            },
          }}
        />
        <Skeleton
          variant="text"
          width={180}
          height={20}
          sx={{
            fontSize: '0.875rem',
            backgroundColor: 'rgba(203, 213, 225, 0.1)',
          }}
        />
      </Box>
    </SkeletonContainer>
  );
}