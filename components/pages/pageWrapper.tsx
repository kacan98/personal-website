import React from "react";
import { Box, Typography } from "@mui/material";
import { Container } from "@mui/system";

type PageWrapperProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
};

function PageWrapper({ children, title, description }: PageWrapperProps) {
  return (
    <Container
      sx={{
        margin: "100px auto",
        textAlign: "center",
      }}
    >
      <Box m={5} mb={15}>
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
