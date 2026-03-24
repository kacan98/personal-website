import fs from "fs";
import path from "path";
import { cache, type ComponentType } from "react";

export type IndustrySolution = {
  title: string;
  description: string;
};

export type IndustryPageDocument = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  cardSummary: string;
  heroTitle: string;
  heroDescription: string;
  painPoints: string[];
  solutions: IndustrySolution[];
  ctaSubject: string;
  ctaLabel: string;
  locale: string;
  Content: ComponentType;
};

type IndustryFrontmatter = Omit<IndustryPageDocument, "locale" | "Content">;

type IndustryMdxModule = {
  default: ComponentType;
  metadata?: IndustryFrontmatter;
};

type SupportedLocale = "en" | "da" | "sv";

export const INDUSTRY_ROUTE_PREFIX = "/industries";
export const INDUSTRY_PAGE_SLUGS = [
  "accounting-firms",
  "agencies-and-consultancies",
  "transport-and-logistics",
] as const;

function normalizeLocale(locale: string): SupportedLocale {
  if (locale === "da" || locale === "sv") return locale;
  return "en";
}

function getLocaleDir(locale: SupportedLocale): string {
  if (locale === "da") return "data/industries-da";
  if (locale === "sv") return "data/industries-sv";
  return "data/industries";
}

async function importLocalizedIndustryModule(locale: SupportedLocale, slug: string): Promise<IndustryMdxModule> {
  switch (locale) {
    case "da":
      return import(`../data/industries-da/${slug}.mdx`) as Promise<IndustryMdxModule>;
    case "sv":
      return import(`../data/industries-sv/${slug}.mdx`) as Promise<IndustryMdxModule>;
    case "en":
    default:
      return import(`../data/industries/${slug}.mdx`) as Promise<IndustryMdxModule>;
  }
}

async function readIndustryFile(
  filePath: string,
  importer: () => Promise<IndustryMdxModule>,
  locale: SupportedLocale,
): Promise<IndustryPageDocument | null> {
  if (!fs.existsSync(filePath)) return null;

  const mdxModule = await importer();
  const frontmatter = (mdxModule.metadata || {}) as IndustryFrontmatter;

  return {
    slug: frontmatter.slug || path.basename(filePath, ".mdx"),
    title: frontmatter.title || "Untitled",
    eyebrow: frontmatter.eyebrow || "Industry page",
    description: frontmatter.description || "",
    cardSummary: frontmatter.cardSummary || frontmatter.description || "",
    heroTitle: frontmatter.heroTitle || frontmatter.title || "",
    heroDescription: frontmatter.heroDescription || frontmatter.description || "",
    painPoints: frontmatter.painPoints || [],
    solutions: frontmatter.solutions || [],
    ctaSubject: frontmatter.ctaSubject || "Website enquiry",
    ctaLabel: frontmatter.ctaLabel || "Get in touch",
    locale,
    Content: mdxModule.default,
  };
}

export const getIndustryPageBySlug = cache(async (locale: string, slug: string): Promise<IndustryPageDocument | null> => {
  const normalizedLocale = normalizeLocale(locale);
  const localizedPath = path.join(process.cwd(), getLocaleDir(normalizedLocale), `${slug}.mdx`);
  const fallbackPath = path.join(process.cwd(), "data/industries", `${slug}.mdx`);

  return (
    await readIndustryFile(localizedPath, () => importLocalizedIndustryModule(normalizedLocale, slug), normalizedLocale) ||
    (normalizedLocale === "en"
      ? null
      : await readIndustryFile(fallbackPath, () => importLocalizedIndustryModule("en", slug), "en"))
  );
});

export async function getAllIndustryPages(locale: string): Promise<IndustryPageDocument[]> {
  const pages = await Promise.all(INDUSTRY_PAGE_SLUGS.map((slug) => getIndustryPageBySlug(locale, slug)));
  return pages.filter((page): page is IndustryPageDocument => Boolean(page));
}
