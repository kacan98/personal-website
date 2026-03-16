import PortfolioPage from "@/components/pages/portfolio/portfolioPage";
import { getTranslations } from "next-intl/server";

interface ProjectsProps {
  params: Promise<{ locale: string }>;
}

export default async function Projects({ params }: ProjectsProps) {
  const { locale } = await params;
  const t = await getTranslations("projects");

  return <PortfolioPage title={t("title")} locale={locale} />;
}
