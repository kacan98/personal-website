import PortfolioPage from "@/components/pages/portfolio/portfolioPage";
import { getTranslations } from 'next-intl/server';

interface PortfolioProps {
  params: Promise<{ locale: string }>;
}

export default async function Portfolio({ params }: PortfolioProps) {
  const { locale } = await params;
  const t = await getTranslations('projects');

  return <PortfolioPage
    title={t('title')}
    locale={locale}
  />;
}