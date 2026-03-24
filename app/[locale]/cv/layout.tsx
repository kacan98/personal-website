import { AuthProvider } from '@/contexts/AuthContext';
import StoreProvider from '@/app/StoreProvider';
import { getCvSettings } from '@/data/cv-server';

interface CvLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function CvLayout({ children, params }: CvLayoutProps) {
  const { locale } = await params;
  const cvSettings = await getCvSettings(locale);

  return (
    <AuthProvider>
      <StoreProvider cvConfig={cvSettings}>{children}</StoreProvider>
    </AuthProvider>
  );
}
