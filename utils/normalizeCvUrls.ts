import { toAbsoluteSiteUrl } from "@/data/settings";
import { CVSettings, CvSection, CvSubSection, BulletPoint } from "@/types";

function normalizeBulletPointUrl(bulletPoint: BulletPoint): BulletPoint {
  if (!bulletPoint.url || !bulletPoint.url.startsWith("/")) {
    return bulletPoint;
  }

  return {
    ...bulletPoint,
    url: toAbsoluteSiteUrl(bulletPoint.url),
  };
}

function normalizeSubSectionUrls(subSection: CvSubSection): CvSubSection {
  return {
    ...subSection,
    bulletPoints: subSection.bulletPoints?.map(normalizeBulletPointUrl) ?? subSection.bulletPoints,
  };
}

function normalizeSectionUrls(section: CvSection): CvSection {
  return {
    ...section,
    bulletPoints: section.bulletPoints?.map(normalizeBulletPointUrl) ?? section.bulletPoints,
    subSections: section.subSections?.map(normalizeSubSectionUrls) ?? section.subSections,
  };
}

export function normalizeCvUrls(cv: CVSettings): CVSettings {
  return {
    ...cv,
    mainColumn: cv.mainColumn?.map(normalizeSectionUrls) ?? cv.mainColumn,
    sideColumn: cv.sideColumn?.map(normalizeSectionUrls) ?? cv.sideColumn,
  };
}
