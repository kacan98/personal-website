import { AuthProvider } from '@/contexts/AuthContext';

interface CvLayoutProps {
  children: React.ReactNode;
}

export default function CvLayout({ children }: CvLayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
