import React from "react";
import { Box, Typography } from "@mui/material";
import { Container } from "@mui/system";

type PageWrapperProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  containerMaxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
};

function PageWrapper({
  children,
  title,
  description,
  containerMaxWidth,
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
        <Typography variant={"h2"}>{title}</Typography>
        {description && (
          <Typography variant={"body1"}>{description}</Typography>
        )}
      </Box>
      {children}
    </Container>
  );
}

export default PageWrapper;
