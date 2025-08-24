import About from "@/components/pages/about/about";
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');
  
  return (
    <About
      heading={t('title')}
      bodyContent={t('content')}
      buttonText={t('contactButton')}
      buttonHref="mailto:karel.cancara@gmail.com"
      linkedinButtonText={t('linkedinButton')}
    />
  );
}