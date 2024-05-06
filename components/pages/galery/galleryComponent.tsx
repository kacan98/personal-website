"use client";
import React, { useState } from "react";
import { a, useTransition } from "@react-spring/web";
import { Project } from "@/sanity/schemaTypes/project";
import { ProjectCard } from "@/components/pages/portfolio/projects/projectCard";
import Grid2 from "@mui/material/Unstable_Grid2";
import ProjectFilter from "@/components/pages/portfolio/projects/projectFilter";
import { useMediaQuery } from "@mui/system";
import { Theme } from "@mui/material";

type GalleryComponentProps = {
  projects: Project[];
};

export const GalleryComponent = ({ projects }: GalleryComponentProps) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const isBigScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm"),
  );

  const uniqueTags = Array.from(
    new Set(projects.flatMap((project) => project.tags)),
  )
    .sort()
    //I accidentally added an empty string to the tags array in sanity studio
    //So make sure it does not happen to others
    .filter((tag) => !!tag);

  //Has to be above filtering projects
  uniqueTags.unshift("All");

  const filteredProjects =
    selectedTag && selectedTag !== "All" && uniqueTags.length > 1 && isBigScreen
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
      {uniqueTags.length > 1 && (
        <Grid2>
          {isBigScreen && (
            <ProjectFilter
              selectedFilter={selectedTag}
              setSelectedFilter={setSelectedTag}
              filters={uniqueTags}
            />
          )}
        </Grid2>
      )}

      <Grid2
        container
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {transitions((props, project) => (
          <a.div style={props}>
            <ProjectCard key={project.title} {...project} />
          </a.div>
        ))}
      </Grid2>
    </Grid2>
  );
};

export default GalleryComponent;
