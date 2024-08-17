"use client";
import { CvTranslateParams } from "@/app/api/translate-cv/route";
import PageWrapper from "@/components/pages/pageWrapper";
import Print from "@/components/print";
import { CvSection as CvSectionSanitySchemaType } from "@/sanity/schemaTypes/cv/cvSection";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { CvComponent } from "./cvComponent";
import CvLanguageSelectionComponent from "./cvLanguageSelect";

export type CvProps = {
  name: string;
  intro: string;
  // picture: string;
  mainSection: CvSectionSanitySchemaType[];
  sideSection?: CvSectionSanitySchemaType[];
};

function CvPage(cvProps: CvProps) {
  const [selectedLanguage, setLanguage] = useState("English");
  const [translatedCv, setTranslatedCv] = useState<CvProps | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedLanguage === "English") {
      setTranslatedCv(null);
      return;
    }

    const cvTranslateParams: CvTranslateParams = {
      cvBody: cvProps,
      targetLanguage: selectedLanguage,
    };

    setOpen(true);
    fetch("/api/translate-cv", {
      method: "POST",
      body: JSON.stringify(cvTranslateParams),
    })
      .then(async (res) => {
        const data = await res.json();
        setTranslatedCv(JSON.parse(data));
      })
      .catch((err) => console.error(err)) //TODO: handle error
      .finally(() => setOpen(false));
  }, [cvProps, selectedLanguage]);

  const handleLanguageChange = async (l: any) => {
    setLanguage(l.target.value);
  };
  return (
    <PageWrapper title={"CV"}>
      <Box sx={{ mb: 5 }}>
        <CvLanguageSelectionComponent
          selectedLanguage={selectedLanguage}
          handleLanguageChange={handleLanguageChange}
        />
      </Box>

      <Print fileName={`${cvProps.name}_CV`}>
        {translatedCv ? (
          <CvComponent {...translatedCv} />
        ) : (
          <CvComponent {...cvProps} />
        )}
      </Print>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </PageWrapper>
  );
}

export default CvPage;
