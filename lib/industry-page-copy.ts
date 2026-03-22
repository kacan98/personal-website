import { getTranslations } from "next-intl/server";

export type IndustryPageCopy = {
  overviewEyebrow: string;
  overviewTitle: string;
  overviewDescription: string;
  openPageLabel: string;
  selectedWorkLabel: string;
  painPointsLabel: string;
  examplesLabel: string;
  startHereTitle: string;
  startHereBody: string;
  bridgeBody: string;
  finalCtaBody: string;
};

export function getIndustryPageCopy(t: Awaited<ReturnType<typeof getTranslations>>): IndustryPageCopy {
  return {
    overviewEyebrow: t("overviewEyebrow"),
    overviewTitle: t("overviewTitle"),
    overviewDescription: t("overviewDescription"),
    openPageLabel: t("openPageLabel"),
    selectedWorkLabel: t("selectedWorkLabel"),
    painPointsLabel: t("painPointsLabel"),
    examplesLabel: t("examplesLabel"),
    startHereTitle: t("startHereTitle"),
    startHereBody: t("startHereBody"),
    bridgeBody: t("bridgeBody"),
    finalCtaBody: t("finalCtaBody"),
  };
}
