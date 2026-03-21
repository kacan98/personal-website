import { IndustryOverviewPage } from "@/components/pages/industries/IndustryLandingPage";
import { getAllIndustryPages } from "@/lib/industry-pages";
import { SITE_NAME } from "@/lib/site-metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Industry pages | ${SITE_NAME}`,
    description: "Focused landing pages for accounting firms, agencies and consultancies, and transport and logistics teams.",
  };
}

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const pages = getAllIndustryPages(locale);
  return <IndustryOverviewPage pages={pages} locale={locale} />;
}
