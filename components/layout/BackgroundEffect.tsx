"use client";
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BRAND_COLORS } from '@/app/colors';

// Add a containInParent prop to control positioning behavior
export default function BackgroundEffect({
  containInParent = false
}: {
  containInParent?: boolean
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  // Only apply to root page if onlyForRoot is true
  if (pathname !== '/' && pathname !== '') {
    return null;
  }

  // Choose positioning based on containInParent prop
  const positionType = containInParent ? 'absolute' : 'fixed';

  return (
    <>
      <Box
        suppressHydrationWarning
        className="background-effect"
        sx={{
          position: positionType,
          inset: 0,
          zIndex: 0,
          maxHeight: '100%',
          background: `
            radial-gradient(ellipse 80% 50% at 30% 20%, rgba(${BRAND_COLORS.accentRgb}, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 70% 80%, rgba(${BRAND_COLORS.accentRgb}, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, rgba(${BRAND_COLORS.accentRgb}, 0.03) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}
      />
      <Box
        suppressHydrationWarning
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
