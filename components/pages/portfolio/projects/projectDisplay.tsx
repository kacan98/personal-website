"use client";
import { ProjectCard } from "@/components/pages/galery/projectCard";
import ProjectFilter from "@/components/pages/portfolio/projects/projectFilter";
import { Project } from "@/types";
import { Box, Grid } from "@mui/material";
import { animated, useTransition } from "@react-spring/web";
import { useState } from "react";

type ProjectDisplayProps = {
  projects: Project[];
};

const ProjectDisplay = ({ projects }: ProjectDisplayProps) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const uniqueTags = Array.from(
    new Set(projects.flatMap((project) => project.tags)),
  )
    .sort()
    //I accidentally added an empty string to the tags array in sanity studio
    //So make sure it does not happen to others
    .filter((tag) => !!tag);

  uniqueTags.unshift("All");

  const filteredProjects =
    selectedTag && selectedTag !== "All"
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
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {transitions((props, project) => (
          <animated.div style={props}>
            <ProjectCard key={project.title} {...project} />
          </animated.div>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectDisplay;
