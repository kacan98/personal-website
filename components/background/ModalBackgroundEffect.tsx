import { Box } from '@mui/material';

// A special version of the background effect just for modals
export default function ModalBackgroundEffect() {
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0, // Higher z-index so it's visible within the modal context
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at top center, hsla(222, 80%, 60%, 0.5) 0%, hsla(222, 0%, 0%, 0) 50%, hsla(222, 0%, 0%, 0) 100%)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          width: '100%',
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
          zIndex: 2,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          pointerEvents: 'none'
        }}
      />
    </>
  );
}
