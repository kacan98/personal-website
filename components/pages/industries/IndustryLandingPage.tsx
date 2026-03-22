import { BACKGROUND_COLORS, BRAND_COLORS } from "@/app/colors";
import { getContainerSx } from "@/app/spacing";
import Button from "@/components/ui/Button";
import { settings } from "@/data/settings";
import { type IndustryPageCopy } from "@/lib/industry-page-copy";
import { IndustryPageDocument } from "@/lib/industry-pages";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InsightsIcon from "@mui/icons-material/Insights";
import LayersIcon from "@mui/icons-material/Layers";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import { Box, Chip, Container, Typography } from "@mui/material";
import Link from "next/link";
import type { ReactNode } from "react";

function SectionCard({ title, items, icon }: { title: string; items: string[]; icon: ReactNode }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        backdropFilter: "blur(14px)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, color: "secondary.light" }}>
        {icon}
        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.15rem", md: "1.3rem" } }}>
          {title}
        </Typography>
      </Box>
      <Box component="ul" sx={{ m: 0, pl: 2.5, color: "rgba(255,255,255,0.82)" }}>
        {items.map((item) => (
          <Box component="li" key={item} sx={{ mb: 1.25, lineHeight: 1.75 }}>
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function IndustryLandingPage({ page, locale, copy }: { page: IndustryPageDocument; locale: string; copy: IndustryPageCopy }) {
  const emailHref = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(page.ctaSubject)}`;
  const IndustryContent = page.Content;

  return (
    <Box sx={{ pb: { xs: 8, md: 12 } }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            `radial-gradient(circle at top left, rgba(${BRAND_COLORS.accentRgb}, 0.22), transparent 38%), ` +
            `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))`,
        }}
      >
        <Container sx={{ ...getContainerSx(), pt: { xs: 8, md: 12 }, pb: { xs: 6, md: 8 } }}>
          <Chip label={page.eyebrow} sx={{ mb: 3, color: "#fff", backgroundColor: `rgba(${BRAND_COLORS.accentRgb}, 0.18)`, border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.35)` }} />
          <Typography variant="h1" sx={{ maxWidth: "14ch", fontSize: { xs: "2.5rem", md: "4.4rem" }, lineHeight: 0.98, fontWeight: 700, mb: 2 }}>
            {page.heroTitle}
          </Typography>
          <Typography variant="h5" sx={{ maxWidth: "44rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.65, fontSize: { xs: "1.05rem", md: "1.2rem" }, mb: 4 }}>
            {page.heroDescription}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4 }}>
            {page.outcomes.map((outcome) => (
              <Chip key={outcome} label={outcome} sx={{ height: "auto", py: 1, color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.14)", backgroundColor: "rgba(255,255,255,0.05)" }} />
            ))}
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Button variant="primary" target={emailHref} endIcon={<ArrowOutwardIcon />}>{page.ctaLabel}</Button>
            <Link href={`/${locale}/projects`}><Button variant="outline">{copy.selectedWorkLabel}</Button></Link>
          </Box>
        </Container>
      </Box>

      <Container sx={{ ...getContainerSx(), display: "grid", gap: { xs: 3, md: 4 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 }, mt: { xs: 2, md: 4 } }}>
          {page.solutions.map((solution) => (
            <Box key={solution.title} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", backgroundColor: BACKGROUND_COLORS.surface }}>
              <Typography variant="overline" sx={{ color: "secondary.light", letterSpacing: "0.14em" }}>{copy.solutionLabel}</Typography>
              <Typography variant="h5" sx={{ mt: 1, mb: 1.5, fontWeight: 700 }}>{solution.title}</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.75 }}>{solution.description}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 } }}>
          <SectionCard title={copy.painPointsLabel} items={page.painPoints} icon={<InsightsIcon />} />
          <SectionCard title={copy.approachLabel} items={page.engagementSteps} icon={<PrecisionManufacturingIcon />} />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 } }}>
          <SectionCard title={copy.fitLabel} items={page.proofPoints} icon={<CheckCircleOutlineIcon />} />
          <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", background: `linear-gradient(180deg, rgba(${BRAND_COLORS.accentRgb}, 0.14), rgba(255,255,255,0.03))` }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, color: "secondary.light" }}>
              <LayersIcon />
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.15rem", md: "1.3rem" } }}>{copy.pagePurposeLabel}</Typography>
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.8, mb: 2 }}>{copy.pagePurposeBody}</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.8 }}>{copy.pagePurposeBodyFollowup}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(255,255,255,0.03)",
            "& h1, & h2, & h3": { lineHeight: 1.2, mt: 4, mb: 2, fontWeight: 700 },
            "& h1": { fontSize: "2rem" },
            "& h2": { fontSize: "1.5rem" },
            "& h3": { fontSize: "1.2rem" },
            "& p": { mb: 2, lineHeight: 1.8, color: "rgba(255,255,255,0.8)" },
            "& ul": { mb: 3, pl: 3, color: "rgba(255,255,255,0.8)" },
            "& li": { mb: 1, lineHeight: 1.8 },
            "& figure": { my: 4, mx: 0 },
            "& img": {
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            },
            "& figcaption": {
              mt: 1,
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.8)",
            },
            "& pre": { p: 2, overflowX: "auto", borderRadius: 2, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", mb: 3 },
            "& code": { fontFamily: "monospace" },
            "& a": { color: "secondary.main" },
          }}
        >
          <IndustryContent />
        </Box>
      </Container>
    </Box>
  );
}

export function IndustryOverviewPage({ pages, locale, copy }: { pages: IndustryPageDocument[]; locale: string; copy: IndustryPageCopy }) {
  return (
    <Container sx={{ ...getContainerSx(), py: { xs: 8, md: 12 } }}>
      <Box sx={{ maxWidth: "46rem", mb: { xs: 5, md: 7 } }}>
        <Chip label={copy.overviewEyebrow} sx={{ mb: 3, color: "#fff", backgroundColor: `rgba(${BRAND_COLORS.accentRgb}, 0.18)`, border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.35)` }} />
        <Typography variant="h1" sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, lineHeight: 1, fontWeight: 700, mb: 2 }}>{copy.overviewTitle}</Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.8, fontSize: { xs: "1.05rem", md: "1.15rem" } }}>{copy.overviewDescription}</Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 } }}>
        {pages.map((page) => (
          <Box key={page.slug} sx={{ display: "flex", flexDirection: "column", p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))", minHeight: 320 }}>
            <Typography variant="overline" sx={{ color: "secondary.light", letterSpacing: "0.14em" }}>{page.eyebrow}</Typography>
            <Typography variant="h4" sx={{ mt: 1, mb: 2, fontWeight: 700, lineHeight: 1.1 }}>{page.title}</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.75, mb: 3, flexGrow: 1 }}>{page.cardSummary}</Typography>
            <Link href={`/${locale}/industries/${page.slug}`}><Button variant="outline" endIcon={<ArrowOutwardIcon />}>{copy.openPageLabel}</Button></Link>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
