import { Container, Typography, Box, Chip, Breadcrumbs, Button as MuiButton } from "@mui/material";
import Link from "next/link";
import { notFound } from "next/navigation";
import LaunchIcon from "@mui/icons-material/Launch";
import CodeIcon from "@mui/icons-material/Code";
import { getContainerSx } from "@/app/spacing";
import { BRAND_COLORS } from "@/app/colors";
import { getProjectActionLinks, getProjectBySlug } from "@/lib/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

function renderMarkdownToHtml(content: string): string {
  let html = content
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  html = html.replace(/(?:^[-*] .+$\n?)+/gm, (match) => {
    const items = match
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^[-*] /, ''))
      .map((item) => `<li>${item}</li>`)
      .join('');
    return `<ul>${items}</ul>`;
  });

  html = html
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^<(h1|h2|h3|ul|pre)/.test(block)) {
        return block;
      }
      return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');

  return html;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, locale } = await params;
  const project = getProjectBySlug(locale, slug);

  if (!project) {
    notFound();
  }

  const links = getProjectActionLinks(project);
  const impact = typeof project.metrics?.impact === "string"
    ? project.metrics.impact
    : project.metrics?.impact?.[locale as "en" | "da" | "sv"] || project.metrics?.impact?.en;

  return (
    <Container sx={{ ...getContainerSx(), py: 4 }}>
      <Breadcrumbs sx={{ mb: 4, maxWidth: "70ch", mx: "auto" }}>
        <Link href={"/" + locale}>Home</Link>
        <Link href={"/" + locale + "/projects"}>Projects</Link>
        <Typography color="text.primary">{project.title}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4, maxWidth: "70ch", mx: "auto" }}>
        {project.category ? <Chip label={project.category} sx={{ mb: 2 }} /> : null}
        <Typography variant="h3" sx={{ mb: 2 }}>{project.title}</Typography>
        {project.description ? <Typography variant="subtitle1" sx={{ mb: 3, color: "text.secondary" }}>{project.description}</Typography> : null}
        {impact ? <Typography variant="subtitle1" sx={{ mb: 3, color: "primary.main", fontWeight: "bold" }}>Impact: {impact}</Typography> : null}
        {project.tags?.length ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {project.tags.map((tag) => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
          </Box>
        ) : null}
        {links.length > 0 ? (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {links.map((link) => {
              const isExternal = link.url.startsWith("http");
              const isSource = link.iconName === "gitHub";
              return (
                <MuiButton
                  key={link.url}
                  variant={isSource ? "outlined" : "contained"}
                  href={link.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  startIcon={isSource ? <CodeIcon /> : <LaunchIcon />}
                  sx={{
                    borderColor: BRAND_COLORS.accent,
                    backgroundColor: isSource ? "transparent" : BRAND_COLORS.accent,
                    color: isSource ? BRAND_COLORS.accent : "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {link.title}
                </MuiButton>
              );
            })}
          </Box>
        ) : null}
      </Box>

      <Box
        sx={{
          maxWidth: '70ch',
          mx: 'auto',
          color: 'text.primary',
          '& h1, & h2, & h3': {
            lineHeight: 1.2,
            mt: 4,
            mb: 2,
            fontWeight: 700,
          },
          '& h1': { fontSize: '2rem' },
          '& h2': { fontSize: '1.5rem' },
          '& h3': { fontSize: '1.2rem' },
          '& p': { mb: 2, lineHeight: 1.8, color: 'text.secondary' },
          '& ul': { mb: 3, pl: 3, color: 'text.secondary' },
          '& li': { mb: 1, lineHeight: 1.8 },
          '& pre': {
            p: 2,
            overflowX: 'auto',
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            mb: 3,
          },
          '& code': { fontFamily: 'monospace' },
          '& a': { color: 'secondary.main' },
        }}
        dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(project.content) }}
      />
    </Container>
  );
}
