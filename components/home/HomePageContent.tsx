"use client";

import Contact from "@/components/home/Contact";
import Hero from "@/components/home/Hero";
import SocialIcons from "@/components/home/socialIcons";
import TechList from "@/components/home/Tech";
import Timeline, { TimelineItem } from "@/components/home/Timeline";
import ContentContainer from "@/components/layout/ContentContainer";
import { isKarelsPortfolio } from "@/globalVars";
import { Box, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { motion, useReducedMotion } from "motion/react";
import type { CuratedProject } from "@/lib/cv-projects";
import { Link } from "@/types";

interface ProofPoint {
  eyebrow: string;
  title: string;
  description: string;
}

interface HomePageContentProps {
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

function IntroSection({
  heading,
  points,
}: {
  heading: string;
  points: ProofPoint[];
}) {
  return (
    <Box
      id="proof"
      sx={{
        py: { xs: 7, md: 9 },
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <ContentContainer>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.9fr) minmax(0, 1.1fr)" },
            gap: { xs: 4, md: 5 },
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              maxWidth: "34rem",
              textAlign: { xs: "center", lg: "left" },
              mx: { xs: "auto", lg: 0 },
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.8rem" },
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              {heading}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: { xs: 1.5, md: 2.25 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {points.map((point, index) => (
              <motion.div
                key={point.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
                style={{ height: "100%" }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      p: { xs: 2.5, md: 3.25 },
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.018)",
                    }}
                  >
                  <Typography
                    sx={{
                      mb: 1,
                      fontSize: { xs: "1.15rem", md: "1.2rem" },
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {point.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.76)", lineHeight: 1.65 }}>
                    {point.description}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      </ContentContainer>
    </Box>
  );
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

function SelectedWorkSection({ title, items }: { title: string; items: CuratedProject[] }) {
  return (
    <Box id="selected-work" sx={{ py: { xs: 8, md: 10 } }}>
      <ContentContainer>
        <Box
          sx={{
            mb: { xs: 4, md: 5 },
            maxWidth: "36rem",
            textAlign: { xs: "center", md: "left" },
            mx: { xs: "auto", md: 0 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.6rem" },
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(3, minmax(0, 1fr))" },
            gap: { xs: 2, md: 2.5 },
            alignItems: "stretch",
          }}
        >
          {items.map((item, index) => {
            const isExternal = item.url?.startsWith("http");

            return (
              <motion.div
                key={item.text}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
                viewport={{ once: true, margin: "-60px" }}
                style={{ height: "100%" }}
              >
                <Box
                  component="a"
                  href={item.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    gap: 2,
                    p: { xs: 3, md: 3.5 },
                    borderRadius: 3,
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: index === 1 ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.025)",
                    transition: "transform 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "rgba(255,255,255,0.16)",
                      background: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 2.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.07)",
                        color: "text.secondary",
                      }}
                    >
                      {getProjectIcon(item.iconName)}
                    </Box>
                    <ArrowOutwardIcon sx={{ color: "rgba(255,255,255,0.45)" }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.15rem", md: "1.3rem" },
                      lineHeight: 1.18,
                    }}
                  >
                    {item.text}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>
                    {item.description}
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </ContentContainer>
    </Box>
  );
}

export default function HomePageContent({
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
  const reduceMotion = useReducedMotion();
  const heroProps = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } };

  const sectionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.55 },
      };

  return (
    <>
      <Box
        id="hero"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <ContentContainer fullWidth>
          <motion.div {...heroProps}>
            <Hero firstName="Karel" lastName="Čančara" tagLine={heroTagline} subtitle={heroSubtitle} />
          </motion.div>
        </ContentContainer>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            py: { xs: 2, md: 4 },
          }}
        >
          <SocialIcons direction="column" socials={socials} />
        </Box>
      </Box>

      {isKarelsPortfolio && (
        <>
          <motion.div {...sectionProps}>
            <IntroSection heading={proofHeading} points={proofPoints} />
          </motion.div>

          <Box id="technologies" sx={{ py: { xs: 2, md: 3 } }}>
            <TechList technologies={technologies} />
          </Box>

          <motion.div {...sectionProps}>
            <SelectedWorkSection title={selectedWorkTitle} items={selectedWork} />
          </motion.div>

          <motion.div {...sectionProps}>
            <Box
              id="timeline"
              sx={{
                py: { xs: 4, md: 5 },
                background: "linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0.01))",
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <ContentContainer>
                <Timeline items={careerTimeline} title={timelineTitle} />
              </ContentContainer>
            </Box>
          </motion.div>
        </>
      )}

      <Box id="contact" sx={{ py: { xs: 2, md: 4 } }}>
        <Contact />
      </Box>
    </>
  );
}
