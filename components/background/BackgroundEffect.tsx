import { Box } from '@mui/material';

export default function BackgroundEffect() {
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: -50,
          maxHeight: '100vh',
          background: 'radial-gradient(circle at top center, hsla(222, 80%, 60%, 0.5) 0%, hsla(222, 0%, 0%, 0) 50%, hsla(222, 0%, 0%, 0) 100%)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: -40,
          height: '100%',
          backgroundImage: 'url(/noisetexture.jpg)',
          opacity: 0.2,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none'
        }}
      />
      {/* Subtle dark overlay to make background slightly darker */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: -30,
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          pointerEvents: 'none'
        }}
      />
    </>
  );
}
