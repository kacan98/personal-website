import { AuthProvider } from '@/contexts/AuthContext';

interface ApplicationsLayoutProps {
  children: React.ReactNode;
}

export default function ApplicationsLayout({ children }: ApplicationsLayoutProps) {
  return <AuthProvider eager>{children}</AuthProvider>;
}
