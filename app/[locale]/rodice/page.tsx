"use client";

import React from "react";
import PageWrapper from "@/components/pages/pageWrapper";
import { RodiceSlideshow } from "@/components/pages/rodice/RodiceSlideshow";

export default function RodicePage() {
  return (
    <PageWrapper title="Rodice Gallery" containerMaxWidth="lg">
      <RodiceSlideshow />
    </PageWrapper>
  );
}
