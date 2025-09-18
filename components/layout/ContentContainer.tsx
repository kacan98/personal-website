"use client";
import { Box, Container, ContainerProps, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";
import { SPACING } from "@/app/spacing";

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
  maxWidth = SPACING.maxWidth,
  ...props
}: ContentContainerProps) => {
  // If fullWidth is true, we render a full-width background Box with a contained content Container
  if (fullWidth) {
    return (
      <Box
        sx={{
          width: "100%",
          backgroundColor: background,
          p: padding,
        }}
      >
        <Container
          maxWidth={maxWidth}
          sx={{ px: SPACING.containerPadding } satisfies SxProps<Theme>}
          {...props}
        >
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
        px: SPACING.containerPadding,
        py: padding,
        backgroundColor: background,
      } satisfies SxProps<Theme>}
      {...props}
    >
      {children}
    </Container>
  );
};

export default ContentContainer;
