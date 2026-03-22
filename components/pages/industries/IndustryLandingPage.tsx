import { BRAND_COLORS } from "@/app/colors";
import { getContainerSx } from "@/app/spacing";
import Button from "@/components/ui/Button";
import { settings } from "@/data/settings";
import { type IndustryPageCopy } from "@/lib/industry-page-copy";
import { IndustryPageDocument } from "@/lib/industry-pages";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import { Box, Chip, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <Box sx={{ maxWidth: "42rem" }}>
      <Typography variant="h2" sx={{ fontSize: { xs: "1.7rem", md: "2.2rem" }, lineHeight: 1.05, fontWeight: 700, mb: 1.25 }}>
        {title}
      </Typography>
      {description ? <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.75 }}>{description}</Typography> : null}
    </Box>
  );
}

function VisualPanel({ page, locale }: { page: IndustryPageDocument; locale: string }) {
  const artworkBySlug: Record<string, string> = {
    "accounting-firms": "/images/industries/accounting-firms-photo.jpg",
    "agencies-and-consultancies": "/images/industries/agencies-and-consultancies-photo.jpg",
    "transport-and-logistics": "/images/industries/transport-and-logistics-photo.jpg",
  };
  const artworkSrc = artworkBySlug[page.slug] || artworkBySlug["accounting-firms"];
  const caption = locale === "da"
    ? "Små interne værktøjer, workflow-automatisering og AI-assisteret dokumenttolkning for gentaget driftsarbejde."
    : locale === "sv"
      ? "Små interna verktyg, arbetsflödesautomatisering och AI-assisterad dokumenttolkning för återkommande operativt arbete."
      : "Small internal tools, workflow automation, and AI-assisted document parsing for repetitive operational work.";

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 5,
        border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.22)`,
        background:
          `radial-gradient(circle at top right, rgba(${BRAND_COLORS.accentRgb}, 0.16), transparent 34%), ` +
          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
        boxShadow: "0 24px 56px rgba(0,0,0,0.22)",
      }}
    >
      <Box sx={{ position: "relative", aspectRatio: "1.2 / 1", borderRadius: 3.5, overflow: "hidden", mb: 2.5, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
        <Image src={artworkSrc} alt={page.title} fill sizes="(max-width: 1200px) 100vw, 520px" style={{ objectFit: "cover" }} priority />
      </Box>
      <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.16em" }}>
        {page.eyebrow}
      </Typography>
      <Typography sx={{ mt: 1.25, color: "rgba(255,255,255,0.78)", lineHeight: 1.75 }}>
        {caption}
      </Typography>
    </Box>
  );
}

function InfoCard({ title, body, icon, pain }: { title: string; body: string; icon: ReactNode; pain?: string }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 3.5 },
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: "rgba(255,255,255,0.03)",
      }}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: 2.5,
          display: "grid",
          placeItems: "center",
          color: "#fff",
          background: `linear-gradient(135deg, rgba(${BRAND_COLORS.accentRgb}, 0.84), rgba(${BRAND_COLORS.accentRgb}, 0.45))`,
        }}
      >
        {icon}
      </Box>
      {pain ? (
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 0.4 }}>
          {pain}
        </Typography>
      ) : null}
      <Typography variant="h5" sx={{ mt: 0.25, mb: 1.15, fontWeight: 700, lineHeight: 1.14 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.72 }}>{body}</Typography>
    </Box>
  );
}

function getOfferCopy(locale: string) {
  if (locale === "da") {
    return {
      title: "Hvad det her er",
      lead: "Jeg hjælper teams med at afgrænse og bygge små interne værktøjer og automatiseringer omkring én konkret, gentagen proces.",
      body: "Det her er konsulent- og implementeringsarbejde, ikke et SaaS-produkt. Målet er at gøre én del af den daglige drift enklere, hurtigere eller mere stabil.",
      proof: "Første version leverer værdi hurtigt, så vi kan justere eller udvide projektet uden at spilde tid.",
    };
  }

  if (locale === "sv") {
    return {
      title: "Vad det här är",
      lead: "Jag hjälper team att avgränsa och bygga små interna verktyg och automatiseringar kring en konkret, återkommande process.",
      body: "Det här är konsult- och implementationsarbete, inte en SaaS-produkt. Målet är att göra en del av det dagliga arbetet enklare, snabbare eller mer stabil.",
      proof: "Första versionen levererar värde snabbt, så vi kan justera eller bygga vidare utan att förlora fokus.",
    };
  }

  return {
    title: "What this is",
    lead: "I help teams scope and build small internal tools and workflow automations around one concrete repetitive process.",
    body: "This is consulting and implementation work, not a SaaS product. The goal is to make one part of day-to-day operations simpler, faster, or more reliable.",
    proof: "The first version delivers value quickly, so we can refine or expand it without wasting time.",
  };
}

export function IndustryLandingPage({ page, locale, copy }: { page: IndustryPageDocument; locale: string; copy: IndustryPageCopy }) {
  const emailHref = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(page.ctaSubject)}`;
  const IndustryContent = page.Content;
  const offerCopy = getOfferCopy(locale);
  const askIcons = [<EmailOutlinedIcon key="mail" />, <SyncAltOutlinedIcon key="flow" />, <AutoAwesomeIcon key="auto" />];


  return (
    <Box sx={{ pb: { xs: 8, md: 12 } }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            `radial-gradient(circle at top left, rgba(${BRAND_COLORS.accentRgb}, 0.18), transparent 30%), ` +
            `radial-gradient(circle at bottom right, rgba(255,255,255,0.05), transparent 24%), ` +
            "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
        }}
      >
        <Container
          sx={{
            ...getContainerSx(),
            pt: { xs: 8, md: 12 },
            pb: { xs: 6, md: 8 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.05fr) minmax(320px, 0.95fr)" },
            gap: { xs: 4, md: 5 },
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h1" sx={{ maxWidth: { xs: "14ch", md: "12ch" }, fontSize: { xs: "2.6rem", md: "4.4rem" }, lineHeight: 0.94, fontWeight: 700, mb: 2 }}>
              {page.heroTitle}
            </Typography>
            <Typography sx={{ maxWidth: "42rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.72, fontSize: { xs: "1.04rem", md: "1.14rem" }, mb: 1.5 }}>
              {page.heroDescription}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2.25 }}>
              <Button variant="primary" href={emailHref} endIcon={<ArrowOutwardIcon />}>
                {page.ctaLabel}
              </Button>
              <Link href={`/${locale}/projects`}>
                <Button variant="outline">{copy.selectedWorkLabel}</Button>
              </Link>
            </Box>
          </Box>

          <VisualPanel page={page} locale={locale} />
        </Container>
      </Box>

      <Container sx={{ ...getContainerSx(), display: "grid", gap: { xs: 5, md: 6 }, mt: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.85fr) minmax(0, 1.15fr)" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          <SectionTitle title={offerCopy.title} description={offerCopy.lead} />
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.82, fontSize: { xs: "1rem", md: "1.05rem" } }}>
              {offerCopy.body}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.62)", lineHeight: 1.72 }}>
              {offerCopy.proof}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "grid", gap: 2.5 }}>
          <SectionTitle title={copy.examplesLabel} description={copy.startHereBody} />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 } }}>
            {page.solutions.map((solution, index) => (
              <InfoCard key={solution.title} title={solution.title} body={solution.description} icon={askIcons[index] || <AutoAwesomeIcon />} pain={page.painPoints[index]} />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(255,255,255,0.03)",
          }}
        >
          <IndustryContent />
        </Box>

        <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.28)`, background: `linear-gradient(180deg, rgba(${BRAND_COLORS.accentRgb}, 0.14), rgba(255,255,255,0.03))` }}>
          <SectionTitle title={copy.finalCtaTitle} description={copy.finalCtaBody} />
          <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 1 }}>
            Prefer a quick note? <Link href={emailHref} style={{ color: "inherit", textDecoration: "underline" }}>{settings.contactEmail}</Link>
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)", mt: 1 }}>
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
            <Button variant="primary" href={emailHref} endIcon={<ArrowOutwardIcon />}>
              {page.ctaLabel}
            </Button>
            <Link href={`/${locale}/projects`}>
              <Button variant="outline">{copy.selectedWorkLabel}</Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export function IndustryOverviewPage({ pages, locale, copy }: { pages: IndustryPageDocument[]; locale: string; copy: IndustryPageCopy }) {
  return (
    <Container sx={{ ...getContainerSx(), py: { xs: 8, md: 12 } }}>
      <Box sx={{ maxWidth: "42rem", mb: { xs: 5, md: 7 } }}>
        <Chip label={copy.overviewEyebrow} sx={{ mb: 3, color: "#fff", backgroundColor: `rgba(${BRAND_COLORS.accentRgb}, 0.18)`, border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.35)` }} />
        <Typography variant="h1" sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, lineHeight: 0.98, fontWeight: 700, mb: 2 }}>
          {copy.overviewTitle}
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.8, fontSize: { xs: "1.05rem", md: "1.15rem" } }}>
          {copy.overviewDescription}
        </Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 } }}>
        {pages.map((page) => (
          <Box key={page.slug} sx={{ display: "flex", flexDirection: "column", p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))", minHeight: 320 }}>
            <Typography variant="overline" sx={{ color: "secondary.light", letterSpacing: "0.14em" }}>{page.eyebrow}</Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 2, fontWeight: 700, lineHeight: 1.1 }}>{page.title}</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.72, mb: 3, flexGrow: 1 }}>{page.cardSummary}</Typography>
            <Link href={`/${locale}/industries/${page.slug}`}><Button variant="outline" endIcon={<ArrowOutwardIcon />}>{copy.openPageLabel}</Button></Link>
          </Box>
        ))}
      </Box>
    </Container>
  );
}


