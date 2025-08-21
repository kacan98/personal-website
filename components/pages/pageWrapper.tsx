import React from "react";
import { Container } from "@mui/system";
import SectionHeader from "@/components/ui/SectionHeader";

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
      <SectionHeader
        title={title}
        description={description}
        size="large"
        onClick={onTitleClicked}
      />
      {children}
    </Container >
  );
}

export default PageWrapper;
