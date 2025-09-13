"use client";
import { ModernProjectCard } from "@/components/pages/portfolio/projects/modernProjectCard";
import { Project } from "@/types";
import { Box, Container, Chip } from "@mui/material";
import { BRAND_COLORS } from "@/app/colors";
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';

type ClientProjectDisplayProps = {
  allProjects: Project[];
};

const ClientProjectDisplay = ({ allProjects }: ClientProjectDisplayProps) => {
  const t = useTranslations('projects');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique tags from all projects
  const uniqueTags = useMemo(() =>
    Array.from(new Set(allProjects.flatMap((project) => project.tags)))
      .sort()
      .filter((tag) => !!tag),
    [allProjects]
  );

  // Filter projects based on selected tags
  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) {
      return allProjects;
    }
    return allProjects.filter((project) =>
      selectedTags.some(tag => project.tags.includes(tag))
    );
  }, [allProjects, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        // Remove tag if already selected
        return prev.filter(t => t !== tag);
      } else {
        // Add tag if not selected
        return [...prev, tag];
      }
    });
  };

  const handleClearAll = () => {
    setSelectedTags([]);
  };

  return (
    <Box sx={{
      py: 6,
      minHeight: '100vh',
      backgroundColor: 'background.default'
    }}>
      {/* Filter chips */}
      <Box sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        px: 2,
        mb: 6
      }}>
        <Box sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1,
          maxWidth: "800px",
          width: "100%"
        }}>
          {/* All Projects chip */}
          <Chip
            label={t('allProjects')}
            onClick={handleClearAll}
            sx={{
              backgroundColor: selectedTags.length === 0 ? BRAND_COLORS.accent : 'transparent',
              color: selectedTags.length === 0 ? '#ffffff' : BRAND_COLORS.secondary,
              border: `1px solid ${selectedTags.length === 0 ? BRAND_COLORS.accent : `rgba(${BRAND_COLORS.primaryRgb}, 0.3)`}`,
              fontWeight: 500,
              fontSize: '0.875rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: selectedTags.length === 0 ? BRAND_COLORS.accent : `rgba(${BRAND_COLORS.accentRgb}, 0.1)`,
                borderColor: BRAND_COLORS.accent,
                transform: 'translateY(-2px)',
              }
            }}
          />

          {/* Individual tag chips */}
          {uniqueTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => handleTagToggle(tag)}
              sx={{
                backgroundColor: selectedTags.includes(tag) ? BRAND_COLORS.accent : 'transparent',
                color: selectedTags.includes(tag) ? '#ffffff' : BRAND_COLORS.secondary,
                border: `1px solid ${selectedTags.includes(tag) ? BRAND_COLORS.accent : `rgba(${BRAND_COLORS.primaryRgb}, 0.3)`}`,
                fontWeight: 500,
                fontSize: '0.875rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: selectedTags.includes(tag) ? BRAND_COLORS.accent : `rgba(${BRAND_COLORS.accentRgb}, 0.1)`,
                  borderColor: BRAND_COLORS.accent,
                  transform: 'translateY(-2px)',
                }
              }}
            />
          ))}
        </Box>

        {/* Selected count indicator */}
        {selectedTags.length > 0 && (
          <Box sx={{
            fontSize: '0.875rem',
            color: BRAND_COLORS.secondary,
          }}>
            {selectedTags.length} {selectedTags.length === 1 ? 'tag' : 'tags'} selected • {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </Box>
        )}
      </Box>

      {/* Projects */}
      <Container maxWidth="lg">
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center'
        }}>
          {filteredProjects.map((project, index) => (
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

export default ClientProjectDisplay;