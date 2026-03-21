import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
  outcomes: string[];
  painPoints: string[];
  solutions: IndustrySolution[];
  proofPoints: string[];
  engagementSteps: string[];
  ctaSubject: string;
  ctaLabel: string;
  content: string;
  locale: string;
};

export type IndustryUiCopy = {
  overviewEyebrow: string;
  overviewTitle: string;
  overviewDescription: string;
  openPageLabel: string;
  selectedWorkLabel: string;
  solutionLabel: string;
  painPointsLabel: string;
  approachLabel: string;
  fitLabel: string;
  pagePurposeLabel: string;
  pagePurposeBody: string;
  pagePurposeBodyFollowup: string;
};

export const INDUSTRY_ROUTE_PREFIX = "/industries";
export const INDUSTRY_PAGE_SLUGS = [
  "accounting-firms",
  "agencies-and-consultancies",
  "transport-and-logistics",
] as const;

function getLocaleDir(locale: string): string {
  if (locale === "da") return "data/industries-da";
  if (locale === "sv") return "data/industries-sv";
  return "data/industries";
}

function readIndustryFile(filePath: string, locale: string): IndustryPageDocument | null {
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data: frontmatter, content } = matter(fileContent);

  return {
    slug: frontmatter.slug || path.basename(filePath, ".md"),
    title: frontmatter.title || "Untitled",
    eyebrow: frontmatter.eyebrow || "Industry page",
    description: frontmatter.description || "",
    cardSummary: frontmatter.cardSummary || frontmatter.description || "",
    heroTitle: frontmatter.heroTitle || frontmatter.title || "",
    heroDescription: frontmatter.heroDescription || frontmatter.description || "",
    outcomes: frontmatter.outcomes || [],
    painPoints: frontmatter.painPoints || [],
    solutions: frontmatter.solutions || [],
    proofPoints: frontmatter.proofPoints || [],
    engagementSteps: frontmatter.engagementSteps || [],
    ctaSubject: frontmatter.ctaSubject || "Website enquiry",
    ctaLabel: frontmatter.ctaLabel || "Get in touch",
    content,
    locale,
  };
}

export function getIndustryPageBySlug(locale: string, slug: string): IndustryPageDocument | null {
  const localizedPath = path.join(process.cwd(), getLocaleDir(locale), `${slug}.md`);
  const fallbackPath = path.join(process.cwd(), "data/industries", `${slug}.md`);
  return readIndustryFile(localizedPath, locale) || readIndustryFile(fallbackPath, "en");
}

export function getAllIndustryPages(locale: string): IndustryPageDocument[] {
  return INDUSTRY_PAGE_SLUGS.map((slug) => getIndustryPageBySlug(locale, slug)).filter(
    (page): page is IndustryPageDocument => Boolean(page)
  );
}

export function getIndustryUiCopy(locale: string): IndustryUiCopy {
  if (locale === "da") {
    return {
      overviewEyebrow: "Branche-sider",
      overviewTitle: "Fokuserede sider til de brancher jeg aktivt raekker ud til",
      overviewDescription: "De her sider er lavet til outreach. Hver side forklarer hvilke workflow-problemer jeg kan hjaelpe med, hvilke interne vaerktoejer der giver mening, og hvordan et lille foerste projekt kan se ud.",
      openPageLabel: "Aabn side",
      selectedWorkLabel: "Se udvalgte projekter",
      solutionLabel: "Loesning",
      painPointsLabel: "Hvor teams typisk mister tid",
      approachLabel: "Saadan ville jeg angribe det",
      fitLabel: "Hvorfor det kan vaere et godt fit",
      pagePurposeLabel: "Hvad siden er til for",
      pagePurposeBody: "Det her er ikke en klassisk salgsfunnel. Det er en kort forklaring af den type interne vaerktoejer og workflow-forbedringer jeg kan hjaelpe med i den her branche.",
      pagePurposeBodyFollowup: "Hvis det er relevant, er naeste nyttige skridt en kort samtale om et tilbagevendende workflow, der i dag spilder tid.",
    };
  }

  if (locale === "sv") {
    return {
      overviewEyebrow: "Branschsidor",
      overviewTitle: "Fokuserade sidor foer de branscher jag aktivt kontaktar",
      overviewDescription: "De haer sidorna aer gjorda foer outreach. Varje sida foerklarar vilka arbetsfloedesproblem jag kan hjaelpa till med, vilka interna verktyg som aer rimliga och hur ett litet foersta projekt kan se ut.",
      openPageLabel: "Oeppna sida",
      selectedWorkLabel: "Se utvalda projekt",
      solutionLabel: "Loesning",
      painPointsLabel: "Var team vanligtvis tappar tid",
      approachLabel: "Sa skulle jag angripa det",
      fitLabel: "Varfoer det kan vara en bra match",
      pagePurposeLabel: "Vad sidan aer till foer",
      pagePurposeBody: "Det haer aer inte en klassisk saeljfunnel. Det aer en kompakt foerklaring av vilken typ av interna verktyg och arbetsfloedesfoerbaettringar jag kan hjaelpa till med i den haer branschen.",
      pagePurposeBodyFollowup: "Om det kaenns relevant aer naesta vettiga steg ett kort samtal om ett aaterkommande arbetsfloede som idag sloesar tid.",
    };
  }

  return {
    overviewEyebrow: "Industry pages",
    overviewTitle: "Focused pages for the industries I am actively reaching out to",
    overviewDescription: "These pages are designed to support outreach. Each one explains the kinds of workflow problems I can help with, the kinds of internal tools that make sense, and what a small first project could look like.",
    openPageLabel: "Open page",
    selectedWorkLabel: "See selected work",
    solutionLabel: "Solution",
    painPointsLabel: "Where teams usually lose time",
    approachLabel: "How I would approach it",
    fitLabel: "Why this can be a good fit",
    pagePurposeLabel: "What this page is for",
    pagePurposeBody: "This is not a polished agency-style funnel. It is a compact explanation of the kinds of internal tools and workflow improvements I can help with in this industry.",
    pagePurposeBodyFollowup: "If that is relevant, the next useful step is a short conversation about one recurring workflow that currently wastes time.",
  };
}
