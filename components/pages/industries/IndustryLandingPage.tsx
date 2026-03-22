import { BACKGROUND_COLORS, BRAND_COLORS } from "@/app/colors";
import { getContainerSx } from "@/app/spacing";
import Button from "@/components/ui/Button";
import { settings } from "@/data/settings";
import { type IndustryPageCopy } from "@/lib/industry-page-copy";
import { IndustryPageDocument } from "@/lib/industry-pages";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InsightsIcon from "@mui/icons-material/Insights";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LayersIcon from "@mui/icons-material/Layers";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import { Box, Chip, Container, Typography } from "@mui/material";
import Link from "next/link";
import type { ReactNode } from "react";

function SectionIntro({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <Box sx={{ maxWidth: "42rem" }}>
      {eyebrow ? (
        <Typography variant="overline" sx={{ color: "secondary.light", letterSpacing: "0.16em" }}>
          {eyebrow}
        </Typography>
      ) : null}
      <Typography variant="h2" sx={{ mt: eyebrow ? 1.25 : 0, mb: 1.5, fontWeight: 700, fontSize: { xs: "1.8rem", md: "2.4rem" }, lineHeight: 1.05 }}>
        {title}
      </Typography>
      {description ? (
        <Typography sx={{ color: "rgba(255,255,255,0.74)", lineHeight: 1.75 }}>{description}</Typography>
      ) : null}
    </Box>
  );
}

function InfoListCard({ title, items, icon, tone = "default" }: { title: string; items: string[]; icon: ReactNode; tone?: "default" | "accent" }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 3.5 },
        borderRadius: 4,
        border: tone === "accent" ? `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.28)` : "1px solid rgba(255,255,255,0.1)",
        background:
          tone === "accent"
            ? `linear-gradient(180deg, rgba(${BRAND_COLORS.accentRgb}, 0.14), rgba(255,255,255,0.04))`
            : "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.25, color: tone === "accent" ? "#fff" : "secondary.light" }}>
        {icon}
        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.05rem", md: "1.15rem" } }}>
          {title}
        </Typography>
      </Box>
      <Box component="ul" sx={{ m: 0, pl: 2.5, color: "rgba(255,255,255,0.82)" }}>
        {items.map((item) => (
          <Box component="li" key={item} sx={{ mb: 1.1, lineHeight: 1.7 }}>
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SolutionIcon({ index }: { index: number }) {
  const icons = [<TimelineOutlinedIcon key="timeline" />, <RouteOutlinedIcon key="route" />, <AutoAwesomeIcon key="auto" />];
  return icons[index] || <LayersIcon />;
}

function SignalCard({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ p: 2.5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <Typography variant="overline" sx={{ display: "block", color: "rgba(255,255,255,0.62)", letterSpacing: "0.14em" }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.75, color: "#fff", lineHeight: 1.55, fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

export function IndustryLandingPage({ page, locale, copy }: { page: IndustryPageDocument; locale: string; copy: IndustryPageCopy }) {
  const emailHref = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(page.ctaSubject)}`;
  const IndustryContent = page.Content;
  const heroSignals = page.painPoints.slice(0, 3);
  const heroOutcomes = page.outcomes.slice(0, 3);

  return (
    <Box sx={{ pb: { xs: 8, md: 12 } }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            `radial-gradient(circle at top left, rgba(${BRAND_COLORS.accentRgb}, 0.2), transparent 32%), ` +
            `radial-gradient(circle at bottom right, rgba(255,255,255,0.06), transparent 28%), ` +
            `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))`,
        }}
      >
        <Container
          sx={{
            ...getContainerSx(),
            pt: { xs: 8, md: 12 },
            pb: { xs: 6, md: 8 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.15fr) minmax(320px, 0.85fr)" },
            gap: { xs: 4, md: 5 },
            alignItems: "start",
          }}
        >
          <Box>
            <Chip
              label={page.eyebrow}
              sx={{
                mb: 3,
                color: "#fff",
                backgroundColor: `rgba(${BRAND_COLORS.accentRgb}, 0.18)`,
                border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.35)`,
              }}
            />
            <Typography variant="h1" sx={{ maxWidth: "12ch", fontSize: { xs: "2.7rem", md: "4.6rem" }, lineHeight: 0.94, fontWeight: 700, mb: 2 }}>
              {page.heroTitle}
            </Typography>
            <Typography sx={{ maxWidth: "40rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, fontSize: { xs: "1.04rem", md: "1.18rem" }, mb: 3 }}>
              {page.heroDescription}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2.5 }}>
              <Button variant="primary" target={emailHref} endIcon={<ArrowOutwardIcon />}>
                {page.ctaLabel}
              </Button>
              <Link href={`/${locale}/projects`}>
                <Button variant="outline">{copy.selectedWorkLabel}</Button>
              </Link>
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.64)", lineHeight: 1.7, maxWidth: "34rem" }}>
              {copy.finalCtaBody}
            </Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 5,
              border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.24)`,
              background: `linear-gradient(180deg, rgba(${BRAND_COLORS.accentRgb}, 0.12), rgba(255,255,255,0.04))`,
              boxShadow: "0 28px 60px rgba(0,0,0,0.24)",
            }}
          >
            <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.72)", letterSpacing: "0.16em" }}>
              {copy.resultsLabel}
            </Typography>
            <Box sx={{ display: "grid", gap: 1.25, mt: 2.25, mb: 3.5 }}>
              {heroOutcomes.map((outcome) => (
                <Box key={outcome} sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
                  <CheckCircleOutlineIcon sx={{ mt: "2px", color: `rgb(${BRAND_COLORS.accentRgb})` }} />
                  <Typography sx={{ color: "#fff", lineHeight: 1.6 }}>{outcome}</Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.16em" }}>
              {copy.commonSignalsLabel}
            </Typography>
            <Box sx={{ display: "grid", gap: 1.5, mt: 2 }}>
              {heroSignals.map((item, index) => (
                <SignalCard key={item} label={`${index + 1}`} value={item} />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container sx={{ ...getContainerSx(), display: "grid", gap: { xs: 4, md: 5 }, mt: { xs: 4, md: 6 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 } }}>
          {page.solutions.map((solution, index) => (
            <Box
              key={solution.title}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: BACKGROUND_COLORS.surface,
              }}
            >
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, display: "grid", placeItems: "center", color: "#fff", background: `linear-gradient(135deg, rgba(${BRAND_COLORS.accentRgb}, 0.82), rgba(${BRAND_COLORS.accentRgb}, 0.42))` }}>
                <SolutionIcon index={index} />
              </Box>
              <Typography variant="overline" sx={{ display: "block", mt: 2.25, color: "secondary.light", letterSpacing: "0.14em" }}>
                {copy.solutionLabel}
              </Typography>
              <Typography variant="h5" sx={{ mt: 1, mb: 1.25, fontWeight: 700, lineHeight: 1.15 }}>
                {solution.title}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.72 }}>{solution.description}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 } }}>
          <InfoListCard title={copy.painPointsLabel} items={page.painPoints} icon={<InsightsIcon />} />
          <InfoListCard title={copy.firstStepLabel} items={page.engagementSteps} icon={<PrecisionManufacturingIcon />} tone="accent" />
          <InfoListCard title={copy.fitLabel} items={page.proofPoints} icon={<Inventory2OutlinedIcon />} />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.05fr) minmax(300px, 0.95fr)" }, gap: { xs: 3, md: 4 }, alignItems: "start" }}>
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "rgba(255,255,255,0.03)",
              "& h1, & h2, & h3": { lineHeight: 1.2, mt: 0, mb: 2, fontWeight: 700 },
              "& h1": { fontSize: "2rem" },
              "& h2": { fontSize: "1.5rem" },
              "& h3": { fontSize: "1.2rem" },
              "& p": { mb: 2, lineHeight: 1.8, color: "rgba(255,255,255,0.8)" },
              "& ul": { mb: 0, pl: 3, color: "rgba(255,255,255,0.8)" },
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
            <SectionIntro title={copy.examplesLabel} description={copy.pagePurposeBody} />
            <Box sx={{ mt: 3 }}>
              <IndustryContent />
            </Box>
          </Box>

          <Box sx={{ display: "grid", gap: 2.5 }}>
            <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", background: `linear-gradient(180deg, rgba(${BRAND_COLORS.accentRgb}, 0.16), rgba(255,255,255,0.03))` }}>
              <SectionIntro title={copy.pagePurposeLabel} description={copy.pagePurposeBodyFollowup} />
            </Box>
            <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.28)`, backgroundColor: "rgba(255,255,255,0.03)" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1, mb: 1.5 }}>
                {copy.finalCtaTitle}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.75, mb: 3 }}>
                {copy.finalCtaBody}
              </Typography>
              <Button variant="primary" target={emailHref} endIcon={<ArrowOutwardIcon />}>
                {page.ctaLabel}
              </Button>
            </Box>
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
