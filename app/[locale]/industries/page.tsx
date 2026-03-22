import { IndustryOverviewPage } from "@/components/pages/industries/IndustryLandingPage";
import { getIndustryPageCopy } from "@/lib/industry-page-copy";
import { getAllIndustryPages } from "@/lib/industry-pages";
import { SITE_NAME } from "@/lib/site-metadata";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "industries" });

  return {
    title: `${t("overviewEyebrow")} | ${SITE_NAME}`,
    description: t("overviewDescription"),
  };
}

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "industries" });
  const pages = await getAllIndustryPages(locale);

  return <IndustryOverviewPage pages={pages} locale={locale} copy={getIndustryPageCopy(t)} />;
}
