"use client";
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';

export default function BackgroundEffect({ onlyForRoot = false }: { onlyForRoot?: boolean }) {
  // Only apply to root page if onlyForRoot is true
  const pathname = usePathname();
  
  if (onlyForRoot && pathname !== '/' && pathname !== '') {
    return null;
  }
  
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          maxHeight: '100vh',
          background: 'radial-gradient(circle at top center, hsla(222, 80%, 60%, 0.5) 0%, hsla(222, 0%, 0%, 0) 50%, hsla(222, 0%, 0%, 0) 100%)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          height: '100%',
          backgroundImage: 'url(/noisetexture.jpg)',
          opacity: 0.2,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none'
        }}
      />
    </>
  );
}
