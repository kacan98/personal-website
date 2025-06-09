import { ReactNode } from 'react';
import BackgroundEffect from './BackgroundEffect';

interface BackgroundLayoutProps {
  children: ReactNode;
}

export default function BackgroundLayout({ children }: BackgroundLayoutProps) {
  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh',
      backgroundColor: 'transparent' // Use transparent to ensure we don't override theme backgrounds
    }}>
      <BackgroundEffect />
      {children}
    </div>
  );
}
