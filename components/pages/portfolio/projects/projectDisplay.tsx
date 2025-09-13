import { ModernProjectCard } from "@/components/pages/portfolio/projects/modernProjectCard";
import ClientProjectFilter from "@/components/pages/portfolio/projects/clientProjectFilter";
import { Project } from "@/types";
import { Box, Container } from "@mui/material";

type ProjectDisplayProps = {
  projects: Project[];
  allProjects: Project[];
  selectedTags?: string[];
};

// Modern Horizontal Cards - Clean, professional layout with image-text split
const ProjectDisplay = ({ projects, allProjects, selectedTags }: ProjectDisplayProps) => {
  // Get unique tags from ALL projects, not just filtered ones
  const uniqueTags = Array.from(
    new Set(allProjects.flatMap((project) => project.tags)),
  )
    .sort()
    .filter((tag) => !!tag);

  return (
    <Box sx={{
      py: 6,
      minHeight: '100vh',
      backgroundColor: 'background.default'
    }}>
      <ClientProjectFilter
        allProjects={allProjects}
        uniqueTags={uniqueTags}
        initialSelectedTags={selectedTags}
      />

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8, // Generous spacing between projects
          alignItems: 'center'
        }}>
          {projects.map((project, index) => (
            <Box
              key={project.title}
              className="modern-project-card"
              sx={{
                width: '100%',
                maxWidth: '1000px',
                opacity: 0,
                transform: 'translateY(40px)',
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`,
                '@keyframes fadeInUp': {
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <ModernProjectCard {...project} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectDisplay;
