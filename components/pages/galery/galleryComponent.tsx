"use client";
import { ProjectCard } from "@/components/pages/galery/projectCard";
import ProjectFilter from "@/components/pages/portfolio/projects/projectFilter";
import { Project } from "@/sanity/schemaTypes/project";
import { Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { a, useTransition } from "@react-spring/web";
import Link from "next/link";
import { useState } from "react";

type GalleryComponentProps = {
  projects: Project[];
  filteringIsEnabled: boolean;
};

export const GalleryComponent = ({
  projects,
  filteringIsEnabled,
}: GalleryComponentProps) => {
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const uniqueTags = Array.from(
    new Set(projects.flatMap((project) => project.tags.map((tag) => tag.trim().toLowerCase()))),
  )
    .sort()
    //I accidentally added an empty string to the tags array in sanity studio
    //So make sure it does not happen to others
    .filter((tag) => !!tag);

  //Has to be above filtering projects
  uniqueTags.unshift("all");

  const filteredProjects =
    !!selectedTag &&
      selectedTag !== "all" &&
      uniqueTags.length > 1 ? projects.filter((project) => project.tags.map(t => t.toLocaleLowerCase()).includes(selectedTag.toLowerCase())) : projects;

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
      {filteringIsEnabled && (
        <Grid2 mb={3} p={2}>
          {
            <ProjectFilter
              selectedFilter={selectedTag}
              setSelectedFilter={setSelectedTag}
              filters={uniqueTags}
            />
          }
        </Grid2>
      )}
      <Grid2
        container
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {transitions((props, project) => {
          const card = <ProjectCard {...project} />;
          return (
            <Box key={project.title}>
              <a.div style={props}>
                {project.relatedPage?.slug ? (
                  <Link href={`/project/${project.relatedPage.slug.current}`}>
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </a.div>
            </Box>
          );
        })}
      </Grid2>
    </Grid2>
  );
};

export default GalleryComponent;
