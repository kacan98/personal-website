"use client";
import { Theme } from "@mui/material";
import { useState } from "react";
import {
  Project,
  ProjectCard,
} from "@/components/pages/portfolio/projects/projectCard";
import { a, useTransition } from "@react-spring/web";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useMediaQuery } from "@mui/system";
import ProjectFilter from "@/components/pages/portfolio/projects/projectFilter";

type ProjectDisplayProps = {
  projects: Project[];
};

const ProjectDisplay = ({ projects }: ProjectDisplayProps) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const isBigScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm"),
  );

  const uniqueTags = Array.from(
    new Set(projects.flatMap((project) => project.tags)),
  ).sort();

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
    <Grid2
      container
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
    >
      <Grid2>
        {isBigScreen && (
          <ProjectFilter
            selectedFilter={selectedTag}
            setSelectedFilter={setSelectedTag}
            filters={uniqueTags}
          />
        )}
      </Grid2>

      <Grid2
        container
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {transitions((props, project) => (
          <a.div style={props}>
            <ProjectCard key={project.title} project={project} />
          </a.div>
        ))}
      </Grid2>
    </Grid2>
  );
};

export default ProjectDisplay;
