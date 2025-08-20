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
        margin: "100px auto 50px auto",
        textAlign: "center",
      }}
    >
      <Box m={4} mb={8}>
        <Typography variant="h2" sx={{
          fontSize: { xs: "4rem", md: "5rem" }
        }} onClick={onTitleClicked}>{title}</Typography>
        {description && (
          <Typography variant="body1" color="text.primary" sx={{ mt: 2 }}>
            {description}
          </Typography>
        )}
      </Box>
      {children}
    </Container >
  );
}

export default PageWrapper;
