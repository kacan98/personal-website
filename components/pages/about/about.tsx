import { Box, Typography, Paper, Chip, Divider } from "@mui/material";
import Button from "@/components/ui/Button";
import PageWrapper from "../pageWrapper";
import ProfileImage from "./ProfileImage";

const focusAreas = [
  {
    title: "Product + Ops",
    body: "Internal dashboards and tooling that keep noisy systems stable so teams ship faster.",
  },
  {
    title: "Systems Thinking",
    body: "Frontend polish backed by backend precision, so every screen tells the same truth.",
  },
  {
    title: "Solo Ownership",
    body: "I deliver experiences end-to-end, including docs, tests, automation, and follow-through.",
  },
];

const stats = [
  { label: "Years shipping", value: "7+" },
  { label: "Projects live", value: "14" },
  { label: "Internal tools", value: "8" },
];

const approachTags = [
  "Product engineering",
  "Workflow automation",
  "Operational reality",
  "TypeScript & .NET",
  "Human-first UX",
];

const renderParagraphs = (content: string) =>
  content
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <Typography key={index} component="p" sx={{ mb: 2, lineHeight: 1.7 }}>
        {paragraph}
      </Typography>
    ));

export const About = ({
  heading,
  bodyContent,
  buttonText,
  buttonHref,
  linkedinButtonText = "Add me on LinkedIn",
  onButtonClick,
}: {
  heading: string;
  bodyContent: React.ReactNode;
  buttonText?: string;
  buttonHref?: string;
  linkedinButtonText?: string;
  onButtonClick?: () => void;
}) => {
  return (
    <PageWrapper title={heading} description="Product-minded engineer solving messy operational problems">
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 4, md: 6 }, py: { xs: 3, md: 4 } }}>
        <Box
          component="section"
          sx={{
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.1)",
            background:
              "linear-gradient(180deg, rgba(168,85,247,0.12), rgba(15,15,15,0.8))",
            p: { xs: 3, md: 5 },
            boxShadow: "0 20px 45px rgba(0,0,0,0.35)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1fr)" },
              gap: { xs: 4, md: 5 },
              alignItems: "center",
            }}
          >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Product-savvy engineering for messy operational systems
            </Typography>
            <Box sx={{ color: "rgba(255,255,255,0.8)", mb: 3, lineHeight: 1.7 }}>
              {typeof bodyContent === "string" ? renderParagraphs(bodyContent) : bodyContent}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {buttonText && (
                <Button
                  component="a"
                  href={buttonHref}
                  variant="primary"
                  sx={{ px: 4, py: 1.75 }}
                >
                  {buttonText}
                </Button>
              )}
              <Button
                component="a"
                href="https://www.linkedin.com/in/kcancara"
                variant="outline"
                sx={{ px: 4, py: 1.5 }}
              >
                {linkedinButtonText}
              </Button>
            </Box>
            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {approachTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "text.primary",
                    borderColor: "rgba(255,255,255,0.2)",
                    borderStyle: "solid",
                    borderWidth: 1,
                  }}
                />
              ))}
            </Box>
          </Box>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.08)",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <ProfileImage />
            <Typography variant="subtitle2" sx={{ letterSpacing: "0.3em", color: "text.secondary" }}>
              Product engineer
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Karel Čančara
            </Typography>
            <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
              Frontend and backend delivery for workflows, automation, and engineer-facing UX.
            </Typography>
            <Divider sx={{ width: "100%", borderColor: "rgba(255,255,255,0.1)" }} />
            <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  7+
                </Typography>
                <Typography variant="caption" sx={{ letterSpacing: "0.2em", color: "text.secondary" }}>
                  Years shipping
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  14
                </Typography>
                <Typography variant="caption" sx={{ letterSpacing: "0.2em", color: "text.secondary" }}>
                  Projects live
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  8
                </Typography>
                <Typography variant="caption" sx={{ letterSpacing: "0.2em", color: "text.secondary" }}>
                  Internal tools
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
        </Box>

        <Box component="section" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" sx={{ letterSpacing: "0.2em" }}>
            Focus areas
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
              gap: { xs: 1.5, md: 2.5 },
            }}
          >
            {focusAreas.map((item) => (
              <Paper
                key={item.title}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  minHeight: 180,
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ letterSpacing: "0.3em", color: "text.secondary" }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  {item.body}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        <Box component="section" sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
          {stats.map((stat) => (
            <Paper
              key={stat.label}
              elevation={0}
              sx={{
                flex: "1 1 180px",
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                py: 3,
                px: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ letterSpacing: "0.1em", color: "text.secondary" }}>
                {stat.label}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default About;
