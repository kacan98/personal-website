import { Box, Typography, Button as MuiButton } from "@mui/material";
import { ReactNode } from "react";
import PageWrapper from "../pageWrapper";

export type AboutProps = {
  heading: string;
  bodyContent: ReactNode;
  buttonText?: string;
  buttonHref?: string;
  linkedinButtonText?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  onButtonClick?: () => void;
};

const highlightItems = [
  {
    title: "Product + Ops",
    body: "Internal dashboards, tooling, and workflows that keep noisy products stable without slowing builders down.",
  },
  {
    title: "Systems Thinking",
    body: "I combine frontend polish and backend reliability, so each touchpoint proves the feature actually works.",
  },
  {
    title: "Solo Delivery",
    body: "One developer who ships the experience end-to-end and writes the docs, tests, and automation that follow.",
  },
];

const stats = [
  { label: "Years shipping", value: "7+" },
  { label: "Projects live", value: "14" },
  { label: "Internal tools", value: "8" },
];

const renderParagraphs = (content: string) =>
  content
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <Box component="p" key={index} sx={{ mb: 2, textAlign: "left", lineHeight: 1.7 }}>
        {paragraph}
      </Box>
    ));

export const About = ({
  heading,
  bodyContent,
  buttonText,
  buttonHref,
  linkedinButtonText = "Add me on LinkedIn",
  onButtonClick,
}: AboutProps) => {
  return (
    <PageWrapper title={heading} description="Product-minded engineer solving real operational problems">
      <Box
        sx={{
          maxWidth: "960px",
          mx: "auto",
          px: { xs: 2, md: 0 },
          py: { xs: 3, md: 5 },
        }}
      >
        <Typography variant="h3" sx={{ mb: 3 }}>
          {heading}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "280px minmax(0, 1fr)" },
            gap: { xs: 3, md: 5 },
            alignItems: "start",
          }}
        >
          <Box
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              p: 2.5,
              textAlign: "left",
            }}
          >
            <Typography variant="subtitle2" sx={{ letterSpacing: "0.2em", mb: 1.5, color: "text.secondary" }}>
              Product engineer
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Karel Čančara
            </Typography>
            <Typography sx={{ mt: 1.5, color: "text.secondary" }}>
              Building frontend, backend, and ops tools that keep messy products working and teams focused.
            </Typography>
          </Box>

          <Box
            sx={{
              color: "text.primary",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.7,
            }}
          >
            {typeof bodyContent === "string" ? renderParagraphs(bodyContent) : bodyContent}

            {buttonText && (
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <MuiButton
                  variant="contained"
                  color="primary"
                  href={buttonHref}
                  onClick={onButtonClick}
                  sx={{ textTransform: "none", fontWeight: 600, px: 4 }}
                >
                  {buttonText}
                </MuiButton>
                <MuiButton
                  variant="outlined"
                  href="https://www.linkedin.com/in/kcancara"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: "none", fontWeight: 600, px: 4 }}
                >
                  {linkedinButtonText}
                </MuiButton>
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            mt: 6,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: 2.5,
          }}
        >
          {highlightItems.map((item) => (
            <Box
              key={item.title}
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                p: 3,
                minHeight: 180,
              }}
            >
              <Typography variant="subtitle2" sx={{ letterSpacing: "0.12em", mb: 1, color: "text.secondary" }}>
                {item.title}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6, color: "text.secondary" }}>
                {item.body}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            mt: 5,
            display: "grid",
            gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))" },
            gap: 2,
            textAlign: "center",
          }}
        >
          {stats.map((stat) => (
            <Box
              key={stat.label}
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                py: 3,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ letterSpacing: "0.1em", color: "text.secondary" }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default About;
