"use client";
import { ProjectCard } from "@/components/pages/galery/projectCard";
import { Project } from "@/types";
import { Grid, Chip, Box } from "@mui/material";
import { animated, useTransition } from "@react-spring/web";
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
    //Filter out any empty strings from tags array
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
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
    >
      {filteringIsEnabled && (
        <Grid mb={3} p={2}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {uniqueTags.map((tag) => (
              <Chip
                key={tag}
                label={tag === 'all' ? 'All' : tag}
                onClick={() => setSelectedTag(tag)}
                variant={selectedTag === tag ? 'filled' : 'outlined'}
                color={selectedTag === tag ? 'primary' : 'default'}
                sx={{ textTransform: 'capitalize' }}
              />
            ))}
          </Box>
        </Grid>
      )}
      <Grid
        container
        spacing={3}
        justifyContent={"center"}
        alignItems={"stretch"}
      >
        {transitions((props, project) => {
          const card = <ProjectCard {...project} />;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.title}>
              <animated.div style={props}>
                <Link href={`/project/${project.slug}`}>
                  {card}
                </Link>
              </animated.div>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default GalleryComponent;
