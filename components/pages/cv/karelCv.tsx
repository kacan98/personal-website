import React from "react";
import CvPage from "@/components/pages/cv/cvPage";
import { getCvSettings } from "@/sanity/sanity-utils";

async function KarelCv() {
  const cvSettings = await getCvSettings();

  return (
    <CvPage
      name={cvSettings.name}
      intro={cvSettings.subtitle}
      mainSection={cvSettings.mainColumn}
      sideSection={cvSettings.sideColumn}
    />
  );
}

export default KarelCv;
