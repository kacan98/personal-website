"use client";
import { ProjectCard } from "@/components/pages/galery/projectCard";
import ProjectFilter from "@/components/pages/portfolio/projects/projectFilter";
import { Project } from "@/types";
import { Box, Grid } from "@mui/material";
import { animated, useTransition } from "@react-spring/web";
import { useState } from "react";
import { useTranslations } from 'next-intl';

type ProjectDisplayProps = {
  projects: Project[];
};

const ProjectDisplay = ({ projects }: ProjectDisplayProps) => {
  const t = useTranslations('projects');
  const [selectedTag, setSelectedTag] = useState<string>(t('allProjects'));

  const uniqueTags = Array.from(
    new Set(projects.flatMap((project) => project.tags)),
  )
    .sort()
    //Filter out any empty strings from tags array
    .filter((tag) => !!tag);

  uniqueTags.unshift(t('allProjects'));

  const allProjectsText = t('allProjects');
  const filteredProjects =
    selectedTag && selectedTag !== allProjectsText
      ? projects.filter((project) => project.tags.includes(selectedTag))
      : projects;

  const transitions = useTransition(filteredProjects, {
    from: { opacity: 0, transform: "scale(0.5)", height: 0 },
    enter: { opacity: 1, transform: "scale(1)", height: "auto" },
    leave: { opacity: 0, transform: "scale(0.5)", height: 0 },
    keys: (project) => project.title,
  });

  return (
    <Box p={2}>
      <Box sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mb: 3,
        px: 2
      }}>
        <ProjectFilter
          selectedFilter={selectedTag}
          setSelectedFilter={setSelectedTag}
          filters={uniqueTags}
        />
      </Box>

      <Grid
        container
        spacing={3}
        justifyContent={"center"}
        alignItems={"stretch"}
      >
        {transitions((props, project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.title}>
            <animated.div style={props}>
              <ProjectCard {...project} />
            </animated.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectDisplay;
