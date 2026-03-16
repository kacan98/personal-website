"use client";

import Contact from "@/components/home/Contact";
import SocialIcons from "@/components/home/socialIcons";
import ContentContainer from "@/components/layout/ContentContainer";
import Button from "@/components/ui/Button";
import type { CuratedProject } from "@/lib/cv-projects";
import { Link } from "@/types";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import BoltIcon from "@mui/icons-material/Bolt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { motion } from "motion/react";

interface ProofPoint {
  eyebrow: string;
  title: string;
  description: string;
}

interface TimelineItem {
  title: string;
  company: string;
  period: string;
  description: string[];
}

interface HomePageContentProps {
  locale: string;
  heroTagline: string;
  heroSubtitle: string;
  proofHeading: string;
  proofPoints: ProofPoint[];
  selectedWorkTitle: string;
  selectedWork: CuratedProject[];
  careerTimeline: TimelineItem[];
  timelineTitle: string;
  technologies: Array<{ name: string; color: string }>;
  socials: Link[];
}

type HomePageCopy = {
  identity: string;
  heroHeading: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  operatingStatement: string;
  selectedCases: string;
  coreStack: string;
  focusNow: string;
  focusBody: string;
  operatingLoop: string;
  capabilitiesLabel: string;
  preferredToolbox: string;
  featuredWorkLabel: string;
  caseStudyLabel: string;
  timelineLabel: string;
  contactTitle: string;
  contactSubtitle: string;
};

function getHomePageCopy(locale: string): HomePageCopy {
  if (locale === "da") {
    return {
      identity: "Karel Cancara / Produktorienteret udvikler",
      heroHeading: "Jeg bygger rolige, brugbare produkter til rodet virkeligt arbejde.",
      heroPrimaryCta: "Se projekter",
      heroSecondaryCta: "Læs historien",
      operatingStatement: "Byg produktet. Stram workflowet. Få det til at føles uundgåeligt.",
      selectedCases: "Udvalgte cases",
      coreStack: "Kernestak",
      focusNow: "Fokus nu",
      focusBody:
        "Portfolio-systemer, developer-workflow-værktøjer, AI-assisterede produkter og interfaces der gør teknisk styrke tydelig med det samme.",
      operatingLoop: "Aktuel arbejdsløkke",
      capabilitiesLabel: "Det jeg optimerer for",
      preferredToolbox: "Foretrukken værktøjskasse",
      featuredWorkLabel: "Udvalgt arbejde",
      caseStudyLabel: "Case / produkt",
      timelineLabel: "Tidslinje",
      contactTitle: "Lad os bygge noget brugbart",
      contactSubtitle:
        "Hvis du har brug for en udvikler der kan omsætte produktuklarhed til noget brugere faktisk kan stole på, så start her.",
    };
  }

  if (locale === "sv") {
    return {
      identity: "Karel Cancara / Produktfokuserad utvecklare",
      heroHeading: "Jag bygger lugna, användbara produkter för rörigt verkligt arbete.",
      heroPrimaryCta: "Se projekt",
      heroSecondaryCta: "Läs berättelsen",
      operatingStatement: "Bygg produkten. Skärp arbetsflödet. Få det att kännas självklart.",
      selectedCases: "Utvalda case",
      coreStack: "Kärnstack",
      focusNow: "Fokus nu",
      focusBody:
        "Portföljsystem, verktyg för utvecklarflöden, AI-assisterade produkter och gränssnitt som gör teknisk kvalitet tydlig direkt.",
      operatingLoop: "Nuvarande arbetsloop",
      capabilitiesLabel: "Det jag optimerar för",
      preferredToolbox: "Föredragen verktygslåda",
      featuredWorkLabel: "Utvalt arbete",
      caseStudyLabel: "Case / produkt",
      timelineLabel: "Tidslinje",
      contactTitle: "Låt oss bygga något användbart",
      contactSubtitle:
        "Om du behöver en utvecklare som kan omvandla produktoklarhet till något användare faktiskt kan lita på, börja här.",
    };
  }

  return {
    identity: "Karel Cancara / Product-minded engineer",
    heroHeading: "Shipping calm, useful software for messy real work.",
    heroPrimaryCta: "Explore projects",
    heroSecondaryCta: "Read the story",
    operatingStatement: "Build the product. Tighten the workflow. Make it feel inevitable.",
    selectedCases: "Selected cases",
    coreStack: "Core stack",
    focusNow: "Focus now",
    focusBody:
      "Portfolio systems, developer workflow tools, AI-assisted products, and interfaces that make technical capability feel clear at a glance.",
    operatingLoop: "Current operating loop",
    capabilitiesLabel: "What I optimize for",
    preferredToolbox: "Preferred toolbox",
    featuredWorkLabel: "Featured work",
    caseStudyLabel: "Case study / product",
    timelineLabel: "Career timeline",
    contactTitle: "Let’s build the useful thing",
    contactSubtitle:
      "If you need a developer who can turn product ambiguity into something users can actually trust, start here.",
  };
}

function getProjectIcon(iconName: string) {
  switch (iconName) {
    case "speed":
      return <BoltIcon />;
    case "schedule":
      return <ScheduleIcon />;
    case "dashboard":
      return <DashboardIcon />;
    case "psychology":
      return <PsychologyIcon />;
    default:
      return <BoltIcon />;
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: "0.82rem",
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: "rgba(245, 239, 226, 0.68)",
      }}
    >
      {children}
    </Typography>
  );
}

function HeroSection({
  locale,
  copy,
  heroTagline,
  heroSubtitle,
  proofPoints,
  selectedWork,
  technologies,
}: Pick<
  HomePageContentProps,
  "locale" | "heroTagline" | "heroSubtitle" | "proofPoints" | "selectedWork" | "technologies"
> & {
  copy: HomePageCopy;
}) {
  const topTechnologies = technologies.slice(0, 8);

  return (
    <Box
      id="hero"
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: { xs: 14, md: 15 },
        pb: { xs: 7, md: 10 },
      }}
    >
      <ContentContainer>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.25fr) minmax(320px, 0.85fr)" },
            gap: { xs: 5, lg: 6 },
            alignItems: "stretch",
          }}
        >
          <Box>
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Stack spacing={3}>
                <SectionLabel>{copy.identity}</SectionLabel>
                <Typography
                  component="h1"
                  sx={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: { xs: "3.6rem", sm: "4.4rem", md: "5.7rem" },
                    lineHeight: 0.94,
                    letterSpacing: "-0.045em",
                    maxWidth: "11ch",
                    color: "#f5efe2",
                  }}
                >
                  {copy.heroHeading}
                </Typography>
                <Typography
                  sx={{
                  fontSize: { xs: "1.15rem", md: "1.35rem" },
                    lineHeight: 1.62,
                    color: "rgba(245, 239, 226, 0.78)",
                    maxWidth: "42rem",
                  }}
                >
                  {heroTagline}
                </Typography>
                <Typography
                  sx={{
                  fontSize: { xs: "1rem", md: "1.08rem" },
                    lineHeight: 1.72,
                    color: "rgba(182, 192, 184, 0.96)",
                    maxWidth: "44rem",
                  }}
                >
                  {heroSubtitle}
                </Typography>
              </Stack>
            </motion.div>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: { xs: 4, md: 5 } }}
            >
              <Button
                component="a"
                href={`/${locale}/projects`}
                variant="primary"
                sx={{ px: 4, py: 1.6, fontSize: "1rem" }}
              >
                {copy.heroPrimaryCta}
              </Button>
              <Button
                component="a"
                href={`/${locale}/about`}
                variant="outline"
                sx={{ px: 4, py: 1.6, fontSize: "1rem" }}
              >
                {copy.heroSecondaryCta}
              </Button>
            </Stack>

            <Box
              sx={{
                mt: { xs: 5, md: 6 },
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
                gap: 2,
              }}
            >
              {proofPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.14 + index * 0.1, ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      border: "1px solid rgba(245, 239, 226, 0.12)",
                      borderRadius: "28px",
                      p: 3,
                      background:
                        "linear-gradient(180deg, rgba(19, 36, 31, 0.92), rgba(9, 19, 17, 0.92))",
                    }}
                  >
                    <SectionLabel>{point.eyebrow}</SectionLabel>
                    <Typography
                      sx={{
                        mt: 1.5,
                        mb: 1.5,
                        fontSize: { xs: "1.35rem", md: "1.5rem" },
                        lineHeight: 1.15,
                        color: "#f5efe2",
                      }}
                    >
                      {point.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(182, 192, 184, 0.9)", lineHeight: 1.7 }}>
                      {point.description}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>

          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          >
            <Box
              sx={{
                position: "relative",
                height: "100%",
                minHeight: { xs: 0, lg: "100%" },
                borderRadius: { xs: "28px", md: "36px" },
                p: { xs: 3, md: 4 },
                background:
                  "linear-gradient(180deg, rgba(23, 47, 41, 0.88), rgba(10, 20, 18, 0.96))",
                border: "1px solid rgba(242, 107, 58, 0.18)",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.25)",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "auto -10% 68% 38%",
                  height: 220,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(242, 107, 58, 0.26), transparent 70%)",
                  pointerEvents: "none",
                },
              }}
            >
              <SectionLabel>{copy.operatingLoop}</SectionLabel>
              <Typography
                sx={{
                  mt: 2,
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: { xs: "2rem", md: "2.6rem" },
                  lineHeight: 1,
                  maxWidth: "10ch",
                }}
              >
                {copy.operatingStatement}
              </Typography>

              <Stack spacing={2} sx={{ mt: 4 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: "22px",
                      background: "rgba(245, 239, 226, 0.06)",
                      border: "1px solid rgba(245, 239, 226, 0.08)",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.85rem", color: "rgba(245, 239, 226, 0.62)" }}>
                      {copy.selectedCases}
                    </Typography>
                    <Typography sx={{ mt: 0.8, fontSize: "2.2rem", lineHeight: 1, color: "#f5efe2" }}>
                      {selectedWork.length}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: "22px",
                      background: "rgba(145, 208, 189, 0.08)",
                      border: "1px solid rgba(145, 208, 189, 0.12)",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.85rem", color: "rgba(245, 239, 226, 0.62)" }}>
                      {copy.coreStack}
                    </Typography>
                    <Typography sx={{ mt: 0.8, fontSize: "2.2rem", lineHeight: 1, color: "#f5efe2" }}>
                      TS+
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    borderRadius: "24px",
                    border: "1px solid rgba(245, 239, 226, 0.1)",
                    background: "rgba(7, 17, 14, 0.68)",
                    p: 3,
                  }}
                >
                  <Typography sx={{ fontSize: "0.85rem", color: "rgba(245, 239, 226, 0.62)" }}>
                    {copy.focusNow}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1.2,
                      color: "#f5efe2",
                      lineHeight: 1.6,
                      fontSize: { xs: "1rem", md: "1.05rem" },
                    }}
                  >
                    {copy.focusBody}
                  </Typography>
                  <Divider sx={{ my: 3, borderColor: "rgba(245, 239, 226, 0.08)" }} />
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {topTechnologies.map((tech) => (
                      <Chip
                        key={tech.name}
                        label={tech.name}
                        sx={{
                          borderRadius: "999px",
                          background: "rgba(245, 239, 226, 0.08)",
                          border: "1px solid rgba(245, 239, 226, 0.08)",
                          color: tech.color,
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </motion.div>
        </Box>
      </ContentContainer>

    </Box>
  );
}

function SocialRail({ socials }: { socials: Link[] }) {
  return (
    <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, py: { xs: 2, md: 3 } }}>
      <SocialIcons direction="column" socials={socials} />
    </Box>
  );
}

function CapabilitiesSection({
  copy,
  heading,
  points,
  technologies,
}: {
  copy: HomePageCopy;
  heading: string;
  points: ProofPoint[];
  technologies: Array<{ name: string; color: string }>;
}) {
  return (
    <Box sx={{ py: { xs: 5, md: 8 } }}>
      <ContentContainer>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.9fr) minmax(0, 1.1fr)" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          <Box>
            <SectionLabel>{copy.capabilitiesLabel}</SectionLabel>
            <Typography
              variant="h2"
              sx={{
                mt: 1.5,
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: "2.8rem", md: "4rem" },
                lineHeight: 0.96,
                maxWidth: "10ch",
              }}
            >
              {heading}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: 2,
            }}
          >
            {points.map((point, index) => (
              <motion.div
                key={point.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
              >
                <Box
                  sx={{
                    height: "100%",
                    borderRadius: "26px",
                    p: 3,
                    border: "1px solid rgba(245, 239, 226, 0.08)",
                    background:
                      index === 0
                        ? "linear-gradient(135deg, rgba(242, 107, 58, 0.14), rgba(19, 36, 31, 0.82))"
                        : "linear-gradient(180deg, rgba(19, 36, 31, 0.78), rgba(9, 19, 17, 0.78))",
                  }}
                >
                  <SectionLabel>{point.eyebrow}</SectionLabel>
                  <Typography sx={{ mt: 1.2, mb: 1.2, fontSize: "1.35rem", lineHeight: 1.18 }}>
                    {point.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(182, 192, 184, 0.9)", lineHeight: 1.7 }}>
                    {point.description}
                  </Typography>
                </Box>
              </motion.div>
            ))}

            <Box
              sx={{
                gridColumn: { xs: "1 / -1", md: "span 2" },
                borderRadius: "30px",
                p: { xs: 3, md: 4 },
                border: "1px solid rgba(145, 208, 189, 0.12)",
                background: "linear-gradient(135deg, rgba(11, 28, 24, 0.92), rgba(19, 36, 31, 0.82))",
              }}
            >
              <SectionLabel>{copy.preferredToolbox}</SectionLabel>
              <Stack direction="row" flexWrap="wrap" gap={1.2} sx={{ mt: 2 }}>
                {technologies.map((tech) => (
                  <Chip
                    key={tech.name}
                    label={tech.name}
                    sx={{
                      borderRadius: "999px",
                      px: 0.4,
                      background: "rgba(245, 239, 226, 0.07)",
                      border: "1px solid rgba(245, 239, 226, 0.08)",
                      color: tech.color,
                      fontWeight: 700,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </ContentContainer>
    </Box>
  );
}

function SelectedWorkSectionInner({
  title,
  items,
  label,
  caseStudyLabel,
}: {
  title: string;
  items: CuratedProject[];
  label: string;
  caseStudyLabel: string;
}) {
  return (
    <Box sx={{ py: { xs: 5, md: 8 } }}>
      <ContentContainer>
        <Box sx={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 3, mb: 4 }}>
          <Box sx={{ maxWidth: "40rem" }}>
            <SectionLabel>{label}</SectionLabel>
            <Typography
              variant="h2"
              sx={{
                mt: 1.2,
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: { xs: "2.8rem", md: "3.8rem" },
                lineHeight: 0.97,
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(3, minmax(0, 1fr))" },
            gap: 2.5,
          }}
        >
          {items.map((item, index) => {
            const isExternal = item.url?.startsWith("http");

            return (
              <motion.div
                key={item.text}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
                viewport={{ once: true, margin: "-60px" }}
              >
                <Box
                  component="a"
                  href={item.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: 320,
                    borderRadius: "30px",
                    p: { xs: 3, md: 4 },
                    color: "inherit",
                    border: "1px solid rgba(245, 239, 226, 0.08)",
                    background:
                      index === 1
                        ? "linear-gradient(180deg, rgba(242, 107, 58, 0.12), rgba(19, 36, 31, 0.84))"
                        : "linear-gradient(180deg, rgba(19, 36, 31, 0.88), rgba(9, 19, 17, 0.94))",
                    transition: "transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "rgba(242, 107, 58, 0.22)",
                      boxShadow: "0 20px 45px rgba(0, 0, 0, 0.18)",
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(245, 239, 226, 0.08)",
                          color: "#f26b3a",
                        }}
                      >
                        {getProjectIcon(item.iconName)}
                      </Box>
                      <ArrowOutwardIcon sx={{ color: "rgba(245, 239, 226, 0.55)" }} />
                    </Box>

                    <Typography
                      sx={{
                        mt: 5,
                        fontSize: { xs: "1.5rem", md: "1.7rem" },
                        lineHeight: 1.05,
                        maxWidth: "11ch",
                      }}
                    >
                      {item.text}
                    </Typography>
                    <Typography sx={{ mt: 2.2, color: "rgba(182, 192, 184, 0.92)", lineHeight: 1.75 }}>
                      {item.description}
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 4 }}>
                    <SectionLabel>{caseStudyLabel}</SectionLabel>
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </ContentContainer>
    </Box>
  );
}

function TimelineSection({
  label,
  title,
  items,
}: {
  label: string;
  title: string;
  items: TimelineItem[];
}) {
  return (
    <Box sx={{ py: { xs: 5, md: 8 } }}>
      <ContentContainer>
        <Box sx={{ maxWidth: "38rem", mb: { xs: 4, md: 5 } }}>
          <SectionLabel>{label}</SectionLabel>
          <Typography
            variant="h2"
            sx={{
              mt: 1.2,
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: { xs: "2.8rem", md: "3.8rem" },
              lineHeight: 0.97,
            }}
          >
            {title}
          </Typography>
        </Box>

        <Stack spacing={2}>
          {items.map((item, index) => (
            <motion.div
              key={`${item.company}-${item.period}`}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "220px minmax(0, 1fr)" },
                  gap: { xs: 1.5, md: 4 },
                  p: { xs: 3, md: 3.5 },
                  borderRadius: "28px",
                  border: "1px solid rgba(245, 239, 226, 0.08)",
                  background: "linear-gradient(180deg, rgba(19, 36, 31, 0.74), rgba(9, 19, 17, 0.88))",
                }}
              >
                <Box>
                  <Typography sx={{ color: "#f26b3a", fontSize: "0.88rem", letterSpacing: "0.08em" }}>
                    {item.period}
                  </Typography>
                  <Typography sx={{ mt: 1, fontSize: "1.2rem", lineHeight: 1.15 }}>
                    {item.company}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: { xs: "1.25rem", md: "1.4rem" }, lineHeight: 1.1 }}>
                    {item.title}
                  </Typography>
                  <Stack spacing={1.2} sx={{ mt: 2 }}>
                    {item.description.map((line, lineIndex) => (
                      <Typography
                        key={`${item.company}-${lineIndex}`}
                        sx={{ color: "rgba(182, 192, 184, 0.92)", lineHeight: 1.7 }}
                      >
                        {line.replace(/^-\s*/, "")}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Stack>
      </ContentContainer>
    </Box>
  );
}

export default function HomePageContent({
  locale,
  heroTagline,
  heroSubtitle,
  proofHeading,
  proofPoints,
  selectedWorkTitle,
  selectedWork,
  careerTimeline,
  timelineTitle,
  technologies,
  socials,
}: HomePageContentProps) {
  const copy = getHomePageCopy(locale);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 10% 8%, rgba(242, 107, 58, 0.12), transparent 24%), radial-gradient(circle at 88% 16%, rgba(145, 208, 189, 0.08), transparent 22%)",
            pointerEvents: "none",
          },
        }}
      >
        <HeroSection
          locale={locale}
          copy={copy}
          heroTagline={heroTagline}
          heroSubtitle={heroSubtitle}
          proofPoints={proofPoints}
          selectedWork={selectedWork}
          technologies={technologies}
        />
        <SocialRail socials={socials} />
      </Box>

      <CapabilitiesSection
        copy={copy}
        heading={proofHeading}
        points={proofPoints}
        technologies={technologies}
      />
      <SelectedWorkSectionInner
        title={selectedWorkTitle}
        items={selectedWork}
        label={copy.featuredWorkLabel}
        caseStudyLabel={copy.caseStudyLabel}
      />
      <TimelineSection label={copy.timelineLabel} title={timelineTitle} items={careerTimeline} />

      <Box id="contact">
        <Contact
          title={copy.contactTitle}
          subtitle={copy.contactSubtitle}
        />
      </Box>
    </>
  );
}
