import React from "react";
import { Box, Button, ButtonGroup } from "@mui/material";

type ProjectFilterProps = {
  selectedFilter: string;
  setSelectedFilter: (tag: string) => void;
  filters: string[];
};

function ProjectFilter({
  selectedFilter,
  setSelectedFilter,
  filters,
}: ProjectFilterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        "& > *": {
          m: 1,
        },
      }}
    >
      <ButtonGroup>
        {filters.map((filter) => {
          return (
            <Button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              variant={filter === selectedFilter ? "contained" : "text"}
              color={"primary"}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.1)",
                },
                p: 2,
              }}
            >
              {filter}
            </Button>
          );
        })}
      </ButtonGroup>
    </Box>
  );
}

export default ProjectFilter;
