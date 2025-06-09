import React from "react";
import { Box, Typography } from "@mui/material";
import { Container } from "@mui/system";

type PageWrapperProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  containerMaxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  onTitleClicked?: () => void;
};

function PageWrapper({
  children,
  title,
  description,
  containerMaxWidth,
  onTitleClicked
}: PageWrapperProps) {
  return (
    <Container
      maxWidth={containerMaxWidth}
      sx={{
        margin: "100px auto",
        textAlign: "center",
      }}
    >
      <Box m={4} mb={8}>
        <Typography variant="h2" onClick={onTitleClicked}>{title}</Typography>
        {description && (
          <Typography variant="body1">{description}</Typography>
        )}
      </Box>
      {children}
    </Container>
  );
}

export default PageWrapper;
