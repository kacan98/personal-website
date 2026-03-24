import StoreProvider from '@/app/StoreProvider';

interface ChatbotLayoutProps {
  children: React.ReactNode;
}

export default function ChatbotLayout({ children }: ChatbotLayoutProps) {
  return <StoreProvider cvConfig={undefined}>{children}</StoreProvider>;
}
