"use client";
import { Box, Container, ContainerProps } from "@mui/material";
import { ReactNode } from "react";

interface ContentContainerProps extends Omit<ContainerProps, 'children'> {
  children: ReactNode;
  fullWidth?: boolean; // Whether the background should be full width while content is constrained
  background?: string; // Optional background color
  padding?: number | string; // Optional padding
}

/**
 * A reusable container component that constrains content to a maximum width
 * while allowing the background to extend full-width if desired.
 */
const ContentContainer = ({
  children,
  fullWidth = false,
  background,
  padding = 4,
  maxWidth = "lg",
  ...props
}: ContentContainerProps) => {
  // If fullWidth is true, we render a full-width background Box with a contained content Container
  if (fullWidth) {
    return (
      <Box
        sx={{
          width: "100%",
          backgroundColor: background,
          padding: padding,
        }}
      >
        <Container maxWidth={maxWidth} {...props}>
          {children}
        </Container>
      </Box>
    );
  }

  // Otherwise, just render a contained Container
  return (
    <Container 
      maxWidth={maxWidth} 
      sx={{ 
        padding: padding,
        backgroundColor: background,
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

export default ContentContainer;
