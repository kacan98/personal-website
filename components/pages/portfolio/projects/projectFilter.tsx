import React from "react";
import { Box, Button } from "@mui/material";

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
  // Function to handle button click
  const handleFilterClick = (filter: string) => {
    // If clicking the already selected filter, set to "All" (unselect)
    if (filter === selectedFilter) {
      setSelectedFilter("All");
    } else {
      setSelectedFilter(filter);
    }
  };
  return (
    <Box
      sx={{
        display: "flex", /* Force display on all screen sizes */
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
        gap: 1,
        minHeight: "40px", /* Ensure there's always space for the filter */
      }}
    >
      {filters.map((filter) => (
        <Button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          variant={filter === selectedFilter ? "contained" : "outlined"}
          color="primary"
          sx={{
            m: 0.5,
            color: "white",
            borderColor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "4px",
            fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font on mobile
            ...(filter === selectedFilter && {
              backgroundColor: "rgba(25, 118, 210, 0.7) !important",
              boxShadow: "0 0 8px rgba(25, 118, 210, 0.8) !important",
            }),
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderColor: "white",
            },
          }}
        >
          {filter}
        </Button>
      ))}
    </Box>
  );
}

export default ProjectFilter;
