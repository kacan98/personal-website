import { BACKGROUND_COLORS, BRAND_COLORS } from "@/app/colors";
import { getContainerSx } from "@/app/spacing";
import Button from "@/components/ui/Button";
import { settings } from "@/data/settings";
import { type IndustryPageCopy } from "@/lib/industry-page-copy";
import { IndustryPageDocument } from "@/lib/industry-pages";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InsightsIcon from "@mui/icons-material/Insights";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import { Box, Chip, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type VisualItem = {
  title: string;
  detail: string;
  icon: ReactNode;
};

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <Box sx={{ maxWidth: "42rem" }}>
      <Typography variant="h2" sx={{ fontSize: { xs: "1.7rem", md: "2.2rem" }, lineHeight: 1.05, fontWeight: 700, mb: 1.25 }}>
        {title}
      </Typography>
      {description ? (
        <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.75 }}>{description}</Typography>
      ) : null}
    </Box>
  );
}

function VisualPanel({ page }: { page: IndustryPageDocument }) {
  const itemsBySlug: Record<string, VisualItem[]> = {
    "accounting-firms": [
      {
        title: "Client reminders",
        detail: "Keep missing documents, approvals, and follow-up work moving without rewriting the same messages.",
        icon: <EmailOutlinedIcon />,
      },
      {
        title: "Recurring jobs",
        detail: "Trigger repeatable tasks, owners, and deadlines from the same monthly or quarterly cadence.",
        icon: <AssignmentTurnedInOutlinedIcon />,
      },
      {
        title: "Data preparation",
        detail: "Clean and structure spreadsheet-heavy inputs before review work starts, with AI-assisted extraction where it genuinely helps.",
        icon: <DescriptionOutlinedIcon />,
      },
    ],
    "agencies-and-consultancies": [
      {
        title: "Handoffs",
        detail: "Turn won work into a cleaner kickoff flow with the right tasks, docs, and owners.",
        icon: <SyncAltOutlinedIcon />,
      },
      {
        title: "Approvals",
        detail: "Reduce the back-and-forth around sign-off, revisions, and next steps.",
        icon: <AssignmentTurnedInOutlinedIcon />,
      },
      {
        title: "Draft support",
        detail: "Help with repetitive reporting, research, and first drafts, including selective AI support where review still stays in human hands.",
        icon: <AutoAwesomeIcon />,
      },
    ],
    "transport-and-logistics": [
      {
        title: "Email to status",
        detail: "Convert recurring update emails and documents into structured internal signals, including AI-assisted extraction when the input is messy.",
        icon: <EmailOutlinedIcon />,
      },
      {
        title: "Exceptions",
        detail: "Flag delays, missing paperwork, and follow-up work before they turn into fire drills.",
        icon: <RouteOutlinedIcon />,
      },
      {
        title: "Customer updates",
        detail: "Trigger consistent milestone communication instead of rewriting the same update again and again.",
        icon: <AutoAwesomeIcon />,
      },
    ],
  };

  const items = itemsBySlug[page.slug] || itemsBySlug["accounting-firms"];
  const artworkBySlug: Record<string, string> = {
    "accounting-firms": "/images/industries/accounting-firms-photo.jpg",
    "agencies-and-consultancies": "/images/industries/agencies-and-consultancies-photo.jpg",
    "transport-and-logistics": "/images/industries/transport-and-logistics-photo.jpg",
  };
  const artworkSrc = artworkBySlug[page.slug] || artworkBySlug["accounting-firms"];
  const artworkAlt = page.title + " illustration";

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
      <Box sx={{ position: "relative", aspectRatio: "1.45 / 1", borderRadius: 3.5, overflow: "hidden", mb: 2.5, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
        <Image src={artworkSrc} alt={artworkAlt} fill sizes="(max-width: 1200px) 100vw, 520px" style={{ objectFit: "cover" }} priority />
      </Box>
      <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.16em" }}>
        {page.eyebrow}
      </Typography>
      <Box sx={{ display: "grid", gap: 1.5, mt: 2.25 }}>
        {items.map((item) => (
          <Box
            key={item.title}
            sx={{
              display: "grid",
              gridTemplateColumns: "44px 1fr",
              gap: 1.5,
              alignItems: "start",
              p: 2,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                color: "#fff",
                background: `linear-gradient(135deg, rgba(${BRAND_COLORS.accentRgb}, 0.84), rgba(${BRAND_COLORS.accentRgb}, 0.45))`,
              }}
            >
              {item.icon}
            </Box>
            <Box>
              <Typography sx={{ color: "#fff", fontWeight: 700, mb: 0.4 }}>{item.title}</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.65 }}>{item.detail}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function AskCard({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 3.5 },
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: BACKGROUND_COLORS.surface,
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
      <Typography variant="h5" sx={{ mt: 2.25, mb: 1.25, fontWeight: 700, lineHeight: 1.14 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.72 }}>{body}</Typography>
    </Box>
  );
}

function BulletCard({ title, items, icon }: { title: string; items: string[]; icon: ReactNode }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 3.5 },
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, mb: 2.25, color: "secondary.light" }}>
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

export function IndustryLandingPage({ page, locale, copy }: { page: IndustryPageDocument; locale: string; copy: IndustryPageCopy }) {
  const emailHref = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(page.ctaSubject)}`;
  const IndustryContent = page.Content;
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
            <Chip
              label={page.eyebrow}
              sx={{
                mb: 3,
                color: "#fff",
                backgroundColor: `rgba(${BRAND_COLORS.accentRgb}, 0.18)`,
                border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.35)`,
              }}
            />
            <Typography variant="h1" sx={{ maxWidth: "11ch", fontSize: { xs: "2.6rem", md: "4.5rem" }, lineHeight: 0.94, fontWeight: 700, mb: 2 }}>
              {page.heroTitle}
            </Typography>
            <Typography sx={{ maxWidth: "40rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.72, fontSize: { xs: "1.04rem", md: "1.14rem" }, mb: 3 }}>
              {page.heroDescription}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2.25 }}>
              <Button variant="primary" target={emailHref} endIcon={<ArrowOutwardIcon />}>
                {page.ctaLabel}
              </Button>
              <Link href={`/${locale}/projects`}>
                <Button variant="outline">{copy.selectedWorkLabel}</Button>
              </Link>
            </Box>
          </Box>

          <VisualPanel page={page} />
        </Container>
      </Box>

      <Container sx={{ ...getContainerSx(), display: "grid", gap: { xs: 4, md: 5 }, mt: { xs: 4, md: 6 } }}>
        <SectionTitle
          title={copy.startHereTitle}
          description={copy.startHereBody}
        />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 } }}>
          {page.solutions.map((solution, index) => (
            <AskCard key={solution.title} title={solution.title} body={solution.description} icon={askIcons[index] || <AutoAwesomeIcon />} />
          ))}
        </Box>

        <Box sx={{ maxWidth: "54rem", mx: "auto" }}>
          <Typography sx={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.9, fontSize: { xs: "1rem", md: "1.08rem" } }}>
            {copy.bridgeBody}
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.9fr) minmax(0, 1.1fr)" }, gap: { xs: 3, md: 4 }, alignItems: "start" }}>
          <BulletCard title={copy.painPointsLabel} items={page.painPoints} icon={<InsightsIcon />} />

          <Box
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "rgba(255,255,255,0.03)",
              "& h1, & h2, & h3": { lineHeight: 1.2, mt: 0, mb: 2, fontWeight: 700 },
              "& h1": { fontSize: "2rem" },
              "& h2": { fontSize: "1.45rem" },
              "& h3": { fontSize: "1.15rem" },
              "& p": { mb: 2, lineHeight: 1.8, color: "rgba(255,255,255,0.8)" },
              "& ul": { mb: 0, pl: 3, color: "rgba(255,255,255,0.8)" },
              "& li": { mb: 1, lineHeight: 1.8 },
              "& a": { color: "secondary.main" },
            }}
          >
            <SectionTitle title={copy.examplesLabel} />
            <Box sx={{ mt: 2.5 }}>
              <IndustryContent />
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: `1px solid rgba(${BRAND_COLORS.accentRgb}, 0.28)`, background: `linear-gradient(180deg, rgba(${BRAND_COLORS.accentRgb}, 0.14), rgba(255,255,255,0.03))` }}>
          <Typography sx={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.75, mb: 3 }}>
            {copy.finalCtaBody}
          </Typography>
          <Button variant="primary" target={emailHref} endIcon={<ArrowOutwardIcon />}>
            {page.ctaLabel}
          </Button>
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
