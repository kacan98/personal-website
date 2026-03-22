import { IndustryLandingPage } from "@/components/pages/industries/IndustryLandingPage";
import { getIndustryPageCopy } from "@/lib/industry-page-copy";
import { getIndustryPageBySlug, INDUSTRY_PAGE_SLUGS } from "@/lib/industry-pages";
import { SITE_NAME } from "@/lib/site-metadata";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return INDUSTRY_PAGE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const page = await getIndustryPageBySlug(locale, slug);

  if (!page) {
    return { title: SITE_NAME };
  }

  return {
    title: `${page.title} | ${SITE_NAME}`,
    description: page.description,
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "industries" });
  const page = await getIndustryPageBySlug(locale, slug);

  if (!page) {
    notFound();
  }

  return <IndustryLandingPage page={page} locale={locale} copy={getIndustryPageCopy(t)} />;
}
