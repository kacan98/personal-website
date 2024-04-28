import React from "react";
import CvPage from "@/components/pages/cv/cvPage";
import { karelCvData } from "@/store/staticObjects";

function KarelCv() {
  const mainSections = karelCvData.sections.filter(
    (section) =>
      section.title === "Profile" ||
      section.title === "Work Experience" ||
      section.title === "Projects",
  );

  const sideSections = karelCvData.sections.filter(
    (section) =>
      section.title === "Contact" ||
      section.title === "Skills" ||
      section.title === "Education" ||
      section.title === "Languages",
  );

  return (
    <CvPage
      name={karelCvData.name}
      intro={karelCvData.intro}
      picture="/færøerne_karel.jpg"
      mainSection={mainSections}
      sideSection={sideSections}
    />
  );
}

export default KarelCv;
