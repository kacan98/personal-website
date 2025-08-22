import React from "react";
import { Container } from "@mui/system";
import SectionHeader from "@/components/ui/SectionHeader";
import { SPACING, getPageSx, getContainerSx } from "@/app/spacing";

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
      maxWidth={containerMaxWidth || SPACING.maxWidth}
      sx={{
        ...getPageSx(),
        ...getContainerSx(),
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
