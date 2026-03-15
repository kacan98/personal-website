"use client";

import Contact from "@/components/home/Contact";
import Hero from "@/components/home/Hero";
import SocialIcons from "@/components/home/socialIcons";
import TechList from "@/components/home/Tech";
import Timeline, { TimelineItem } from "@/components/home/Timeline";
import ContentContainer from "@/components/layout/ContentContainer";
import { isKarelsPortfolio } from "@/globalVars";
import { Box, Typography } from "@mui/material";
import BoltIcon from '@mui/icons-material/Bolt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { motion } from "motion/react";
import type { CuratedProject } from '@/lib/cv-projects';
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

function ProofSection({ heading, points }: { heading: string; points: ProofPoint[] }) {
  return (
    <Box id="proof" sx={{ py: { xs: 8, md: 12 } }}>
      <ContentContainer>
        <Box sx={{ mb: { xs: 5, md: 7 }, maxWidth: '42rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <Typography
              variant="h2"
              sx={{
                mt: 1,
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {heading}
            </Typography>
          </motion.div>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {points.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              viewport={{ once: true, margin: "-60px" }}
            >
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  minHeight: { md: 240 },
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, background 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(255,255,255,0.18)',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.05))',
                  },
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    display: 'block',
                    color: 'secondary.light',
                    letterSpacing: '0.14em',
                    fontWeight: 700,
                    mb: 1.5,
                  }}
                >
                  {point.eyebrow}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    fontSize: { xs: '1.25rem', md: '1.45rem' },
                  }}
                >
                  {point.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.82)',
                    lineHeight: 1.7,
                  }}
                >
                  {point.description}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </ContentContainer>
    </Box>
  );
}

function getProjectIcon(iconName: string) {
  switch (iconName) {
    case 'speed':
      return <BoltIcon />;
    case 'schedule':
      return <ScheduleIcon />;
    case 'dashboard':
      return <DashboardIcon />;
    case 'psychology':
      return <PsychologyIcon />;
    default:
      return <BoltIcon />;
  }
}

function SelectedWorkSection({ title, items }: { title: string; items: CuratedProject[] }) {
  return (
    <Box id="selected-work" sx={{ py: { xs: 8, md: 12 } }}>
      <ContentContainer>
        <Box sx={{ mb: { xs: 4, md: 6 }, maxWidth: '36rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.6rem' },
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {title}
            </Typography>
          </motion.div>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {items.map((item, index) => {
            const isExternal = item.url?.startsWith("http");

            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                viewport={{ once: true, margin: "-60px" }}
              >
                <Box
                  component="a"
                  href={item.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: { xs: 3, md: 4 },
                    borderRadius: 4,
                    textDecoration: 'none',
                    color: 'inherit',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.03)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: 'rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255,255,255,0.08)',
                        color: 'secondary.light',
                      }}
                    >
                      {getProjectIcon(item.iconName)}
                    </Box>
                    <ArrowOutwardIcon sx={{ color: 'rgba(255,255,255,0.6)' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', md: '1.35rem' } }}>
                    {item.text}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>
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
  return (
    <>
      <Box id="hero" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <ContentContainer fullWidth>
          <Hero firstName="Karel" lastName="Čančara" tagLine={heroTagline} subtitle={heroSubtitle} />
        </ContentContainer>
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, py: { xs: 2, md: 4 } }}>
          <SocialIcons direction={"column"} socials={socials} />
        </Box>
      </Box>

      {isKarelsPortfolio && (
        <>
          <ProofSection heading={proofHeading} points={proofPoints} />

          <Box id="technologies" sx={{ py: { xs: 1, md: 2 }, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <TechList technologies={technologies} />
          </Box>

          <SelectedWorkSection title={selectedWorkTitle} items={selectedWork} />

          <Box id="timeline" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <ContentContainer>
              <Timeline items={careerTimeline} title={timelineTitle} />
            </ContentContainer>
          </Box>
        </>
      )}

      <Box id="contact" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Contact />
      </Box>
    </>
  );
}
