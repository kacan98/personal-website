"use client";
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';

// Add a containInParent prop to control positioning behavior
export default function BackgroundEffect({
  containInParent = false
}: {
  containInParent?: boolean
}) {
  const pathname = usePathname();

  // Only apply to root page if onlyForRoot is true
  if (pathname !== '/' && pathname !== '') {
    return null;
  }

  // Choose positioning based on containInParent prop
  const positionType = containInParent ? 'absolute' : 'fixed';

  return (
    <>
      <Box
        className="background-effect"
        sx={{
          position: positionType,
          inset: 0,
          zIndex: 0,
          maxHeight: '100%',
          background: 'radial-gradient(circle at top center, hsla(222, 80%, 60%, 0.5) 0%, hsla(222, 0%, 0%, 0) 50%, hsla(222, 0%, 0%, 0) 100%)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: positionType,
          inset: containInParent ? 'auto' : '0',
          zIndex: 0,
          minHeight: containInParent ? "0" : '100%', // Use minHeight to extend with content
          width: '100%',
          backgroundImage: 'url(/noisetexture.jpg)',
          opacity: 0.2,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none'
        }}
      />
    </>
  );
}
