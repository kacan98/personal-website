import { CVSettings, CvSection, CvSubSection, BulletPoint, Paragraph } from '@/types';

/**
 * Generate a stable ID based on title/content
 */
function generateStableId(content: string): string {
  // Use a simple hash of the title/key content that's stable
  return content.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'untitled';
}

function ensureUniqueId(preferredId: string, seenIds: Set<string>, fallbackId: string): string {
  const baseId = preferredId || fallbackId;

  if (!seenIds.has(baseId)) {
    seenIds.add(baseId);
    return baseId;
  }

  let suffix = 1;
  let candidate = `${baseId}-${suffix}`;
  while (seenIds.has(candidate)) {
    suffix += 1;
    candidate = `${baseId}-${suffix}`;
  }

  seenIds.add(candidate);
  return candidate;
}

/**
 * Assign unique IDs to paragraphs if they don't have them
 * Also ensures all nullable fields are present (set to null if missing)
 */
function ensureParagraphIds(paragraphs: Paragraph[], parentId: string): Paragraph[] {
  const seenIds = new Set<string>();

  return paragraphs.map((paragraph, index) => ({
    id: ensureUniqueId(paragraph.id ?? '', seenIds, `${parentId}-para-${index}`),
    text: paragraph.text,
  }));
}

/**
 * Assign unique IDs to bullet points if they don't have them
 * Also ensures all nullable fields are present (set to null if missing)
 */
function ensureBulletPointIds(bulletPoints: BulletPoint[], parentId: string): BulletPoint[] {
  const seenIds = new Set<string>();

  return bulletPoints.map((bullet, index) => ({
    id: ensureUniqueId(bullet.id ?? '', seenIds, `${parentId}-bullet-${index}`),
    iconName: bullet.iconName,
    text: bullet.text,
    url: bullet.url ?? null,
    description: bullet.description ?? null,
  }));
}

/**
 * Assign unique IDs to a subsection and its content if they don't have them
 * Also ensures all nullable fields are present (set to null if missing)
 */
function ensureSubSectionIds(subSection: CvSubSection, parentId: string, index: number, seenIds?: Set<string>): CvSubSection {
  const fallbackId = `${parentId}-sub-${generateStableId(subSection.title ?? `${index}`)}`;
  const subSectionId = ensureUniqueId(subSection.id ?? '', seenIds ?? new Set<string>(), fallbackId);

  return {
    id: subSectionId,
    title: subSection.title ?? null,
    subtitles: subSection.subtitles ? {
      left: subSection.subtitles.left ?? null,
      right: subSection.subtitles.right ?? null,
      leftUrl: subSection.subtitles.leftUrl ?? null,
      rightUrl: subSection.subtitles.rightUrl ?? null,
    } : null,
    paragraphs: subSection.paragraphs ? ensureParagraphIds(subSection.paragraphs, subSectionId) : null,
    bulletPoints: subSection.bulletPoints ? ensureBulletPointIds(subSection.bulletPoints, subSectionId) : null
  };
}

/**
 * Assign unique IDs to a section and all its content if they don't have them
 * Also ensures all nullable fields are present (set to null if missing)
 */
function ensureSectionIds(section: CvSection, column: 'main' | 'side', index: number, seenIds?: Set<string>): CvSection {
  const fallbackId = `${column}-${generateStableId(section.title ?? `section-${index}`)}`;
  const sectionId = ensureUniqueId(section.id ?? '', seenIds ?? new Set<string>(), fallbackId);
  const seenSubSectionIds = new Set<string>();

  return {
    id: sectionId,
    title: section.title ?? null,
    subtitles: section.subtitles ? {
      left: section.subtitles.left ?? null,
      right: section.subtitles.right ?? null,
      leftUrl: section.subtitles.leftUrl ?? null,
      rightUrl: section.subtitles.rightUrl ?? null,
    } : null,
    paragraphs: section.paragraphs ? ensureParagraphIds(section.paragraphs, sectionId) : null,
    bulletPoints: section.bulletPoints ? ensureBulletPointIds(section.bulletPoints, sectionId) : null,
    subSections: section.subSections ? section.subSections.map((sub, subIndex) => ensureSubSectionIds(sub, sectionId, subIndex, seenSubSectionIds)) : null
  };
}

/**
 * Ensure all CV sections and subsections have unique IDs
 * Also ensures all nullable fields are present (set to null if missing)
 * This function is safe to call multiple times - it won't overwrite existing IDs
 */
export function ensureCvIds(cv: CVSettings): CVSettings {
  const seenMainSectionIds = new Set<string>();
  const seenSideSectionIds = new Set<string>();

  return {
    on: cv.on,
    name: cv.name,
    subtitle: cv.subtitle,
    profilePicture: cv.profilePicture ?? null,
    mainColumn: cv.mainColumn.map((section, index) => ensureSectionIds(section, 'main', index, seenMainSectionIds)),
    sideColumn: cv.sideColumn.map((section, index) => ensureSectionIds(section, 'side', index, seenSideSectionIds))
  };
}

/**
 * Find a section by ID in the CV
 */
export function findSectionById(cv: CVSettings, id: string): { section: CvSection; column: 'mainColumn' | 'sideColumn'; index: number } | null {
  for (let index = 0; index < cv.mainColumn.length; index++) {
    const section = cv.mainColumn[index];
    if (section.id === id) {
      return { section, column: 'mainColumn', index };
    }
  }

  for (let index = 0; index < cv.sideColumn.length; index++) {
    const section = cv.sideColumn[index];
    if (section.id === id) {
      return { section, column: 'sideColumn', index };
    }
  }

  return null;
}

/**
 * Find a subsection by ID in the CV
 */
export function findSubSectionById(cv: CVSettings, id: string): {
  subSection: CvSubSection;
  parentSection: CvSection;
  column: 'mainColumn' | 'sideColumn';
  sectionIndex: number;
  subSectionIndex: number
} | null {
  for (let sectionIndex = 0; sectionIndex < cv.mainColumn.length; sectionIndex++) {
    const section = cv.mainColumn[sectionIndex];
    if (section.subSections) {
      for (let subSectionIndex = 0; subSectionIndex < section.subSections.length; subSectionIndex++) {
        const subSection = section.subSections[subSectionIndex];
        if (subSection.id === id) {
          return { subSection, parentSection: section, column: 'mainColumn', sectionIndex, subSectionIndex };
        }
      }
    }
  }

  for (let sectionIndex = 0; sectionIndex < cv.sideColumn.length; sectionIndex++) {
    const section = cv.sideColumn[sectionIndex];
    if (section.subSections) {
      for (let subSectionIndex = 0; subSectionIndex < section.subSections.length; subSectionIndex++) {
        const subSection = section.subSections[subSectionIndex];
        if (subSection.id === id) {
          return { subSection, parentSection: section, column: 'sideColumn', sectionIndex, subSectionIndex };
        }
      }
    }
  }

  return null;
}

/**
 * Compare two CVs and return the differences based on IDs
 */
export function compareCvs(originalCv: CVSettings, currentCv: CVSettings): {
  modifiedSections: Set<string>;
  removedSections: Set<string>;
  newSections: CvSection[];
  modifiedSubSections: Set<string>;
  removedSubSections: Set<string>;
  newSubSections: Array<{ subSection: CvSubSection; parentSectionId: string }>;
} {
  const modifiedSections = new Set<string>();
  const removedSections = new Set<string>();
  const newSections: CvSection[] = [];
  const modifiedSubSections = new Set<string>();
  const removedSubSections = new Set<string>();
  const newSubSections: Array<{ subSection: CvSubSection; parentSectionId: string }> = [];

  const originalSectionsMap = new Map<string, CvSection>();
  [...originalCv.mainColumn, ...originalCv.sideColumn].forEach(section => {
    if (section.id) {
      originalSectionsMap.set(section.id, section);
    }
  });

  [...currentCv.mainColumn, ...currentCv.sideColumn].forEach(currentSection => {
    if (!currentSection.id) {
      newSections.push(currentSection);
      return;
    }

    const originalSection = originalSectionsMap.get(currentSection.id);
    if (!originalSection) {
      newSections.push(currentSection);
    } else {
      if (JSON.stringify(originalSection) !== JSON.stringify(currentSection)) {
        modifiedSections.add(currentSection.id);
      }

      if (currentSection.subSections && originalSection.subSections) {
        const originalSubSectionsMap = new Map<string, CvSubSection>();
        originalSection.subSections.forEach(subSection => {
          if (subSection.id) {
            originalSubSectionsMap.set(subSection.id, subSection);
          }
        });

        currentSection.subSections.forEach(currentSubSection => {
          if (!currentSubSection.id) {
            newSubSections.push({ subSection: currentSubSection, parentSectionId: currentSection.id! });
            return;
          }

          const originalSubSection = originalSubSectionsMap.get(currentSubSection.id);
          if (!originalSubSection) {
            newSubSections.push({ subSection: currentSubSection, parentSectionId: currentSection.id! });
          } else if (JSON.stringify(originalSubSection) !== JSON.stringify(currentSubSection)) {
            modifiedSubSections.add(currentSubSection.id);
          }
        });

        originalSection.subSections.forEach(originalSubSection => {
          if (originalSubSection.id && !currentSection.subSections?.find(s => s.id === originalSubSection.id)) {
            removedSubSections.add(originalSubSection.id);
          }
        });
      }
    }
  });

  [...originalCv.mainColumn, ...originalCv.sideColumn].forEach(originalSection => {
    if (originalSection.id && !findSectionById(currentCv, originalSection.id)) {
      removedSections.add(originalSection.id);
    }
  });

  return {
    modifiedSections,
    removedSections,
    newSections,
    modifiedSubSections,
    removedSubSections,
    newSubSections
  };
}
