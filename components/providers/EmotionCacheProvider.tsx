'use client';

import React from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '@/lib/emotion-cache';

interface EmotionCacheProviderProps {
  children: React.ReactNode;
}

export default function EmotionCacheProvider({ children }: EmotionCacheProviderProps) {
  // Create cache on each render to ensure consistency between server and client
  const [emotionCache] = React.useState(() => createEmotionCache());

  return (
    <CacheProvider value={emotionCache}>
      {children}
    </CacheProvider>
  );
}