import { getTranslations } from "next-intl/server";

export type IndustryPageCopy = {
  overviewEyebrow: string;
  overviewTitle: string;
  overviewDescription: string;
  openPageLabel: string;
  selectedWorkLabel: string;
  solutionLabel: string;
  painPointsLabel: string;
  approachLabel: string;
  fitLabel: string;
  pagePurposeLabel: string;
  pagePurposeBody: string;
  pagePurposeBodyFollowup: string;
  resultsLabel: string;
  commonSignalsLabel: string;
  firstStepLabel: string;
  examplesLabel: string;
  finalCtaTitle: string;
  finalCtaBody: string;
};

export function getIndustryPageCopy(t: Awaited<ReturnType<typeof getTranslations>>): IndustryPageCopy {
  return {
    overviewEyebrow: t("overviewEyebrow"),
    overviewTitle: t("overviewTitle"),
    overviewDescription: t("overviewDescription"),
    openPageLabel: t("openPageLabel"),
    selectedWorkLabel: t("selectedWorkLabel"),
    solutionLabel: t("solutionLabel"),
    painPointsLabel: t("painPointsLabel"),
    approachLabel: t("approachLabel"),
    fitLabel: t("fitLabel"),
    pagePurposeLabel: t("pagePurposeLabel"),
    pagePurposeBody: t("pagePurposeBody"),
    pagePurposeBodyFollowup: t("pagePurposeBodyFollowup"),
    resultsLabel: t("resultsLabel"),
    commonSignalsLabel: t("commonSignalsLabel"),
    firstStepLabel: t("firstStepLabel"),
    examplesLabel: t("examplesLabel"),
    finalCtaTitle: t("finalCtaTitle"),
    finalCtaBody: t("finalCtaBody"),
  };
}
