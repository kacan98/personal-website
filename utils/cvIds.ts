import { CVSettings, CvSection, CvSubSection, BulletPoint, Paragraph } from '@/types';

/**
 * Generate a stable ID based on title/content
 */
function generateStableId(content: string): string {
  // Use a simple hash of the title/key content that's stable
  return content.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'untitled';
}

/**
 * Assign unique IDs to paragraphs if they don't have them
 */
function ensureParagraphIds(paragraphs: Paragraph[], parentId: string): Paragraph[] {
  return paragraphs.map((paragraph, index) => ({
    ...paragraph,
    id: paragraph.id || `${parentId}-para-${index}`
  }));
}

/**
 * Assign unique IDs to bullet points if they don't have them
 */
function ensureBulletPointIds(bulletPoints: BulletPoint[], parentId: string): BulletPoint[] {
  return bulletPoints.map((bullet, index) => ({
    ...bullet,
    id: bullet.id || `${parentId}-bullet-${index}`
  }));
}


/**
 * Assign unique IDs to a subsection and its content if they don't have them
 */
function ensureSubSectionIds(subSection: CvSubSection, parentId: string, index: number): CvSubSection {
  const subSectionId = subSection.id || `${parentId}-sub-${generateStableId(subSection.title || `${index}`)}`;

  return {
    ...subSection,
    id: subSectionId,
    paragraphs: subSection.paragraphs ? ensureParagraphIds(subSection.paragraphs, subSectionId) : undefined,
    bulletPoints: subSection.bulletPoints ? ensureBulletPointIds(subSection.bulletPoints, subSectionId) : undefined
  };
}

/**
 * Assign unique IDs to a section and all its content if they don't have them
 */
function ensureSectionIds(section: CvSection, column: 'main' | 'side', index: number): CvSection {
  const sectionId = section.id || `${column}-${generateStableId(section.title || `section-${index}`)}`;

  return {
    ...section,
    id: sectionId,
    paragraphs: section.paragraphs ? ensureParagraphIds(section.paragraphs, sectionId) : undefined,
    bulletPoints: section.bulletPoints ? ensureBulletPointIds(section.bulletPoints, sectionId) : undefined,
    subSections: section.subSections ? section.subSections.map((sub, subIndex) => ensureSubSectionIds(sub, sectionId, subIndex)) : undefined
  };
}

/**
 * Ensure all CV sections and subsections have unique IDs
 * This function is safe to call multiple times - it won't overwrite existing IDs
 */
export function ensureCvIds(cv: CVSettings): CVSettings {
  return {
    ...cv,
    mainColumn: cv.mainColumn.map((section, index) => ensureSectionIds(section, 'main', index)),
    sideColumn: cv.sideColumn.map((section, index) => ensureSectionIds(section, 'side', index))
  };
}

/**
 * Find a section by ID in the CV
 */
export function findSectionById(cv: CVSettings, id: string): { section: CvSection; column: 'mainColumn' | 'sideColumn'; index: number } | null {
  // Search main column
  for (let index = 0; index < cv.mainColumn.length; index++) {
    const section = cv.mainColumn[index];
    if (section.id === id) {
      return { section, column: 'mainColumn', index };
    }
  }

  // Search side column
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
  // Search main column
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

  // Search side column
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

  // Create maps of original sections by ID for quick lookup
  const originalSectionsMap = new Map<string, CvSection>();
  [...originalCv.mainColumn, ...originalCv.sideColumn].forEach(section => {
    if (section.id) {
      originalSectionsMap.set(section.id, section);
    }
  });

  // Check current sections
  [...currentCv.mainColumn, ...currentCv.sideColumn].forEach(currentSection => {
    if (!currentSection.id) {
      // New section without ID - treat as new
      newSections.push(currentSection);
      return;
    }

    const originalSection = originalSectionsMap.get(currentSection.id);
    if (!originalSection) {
      // New section
      newSections.push(currentSection);
    } else {
      // Check if section is modified
      if (JSON.stringify(originalSection) !== JSON.stringify(currentSection)) {
        modifiedSections.add(currentSection.id);
      }

      // Check subsections
      if (currentSection.subSections && originalSection.subSections) {
        const originalSubSectionsMap = new Map<string, CvSubSection>();
        originalSection.subSections.forEach(subSection => {
          if (subSection.id) {
            originalSubSectionsMap.set(subSection.id, subSection);
          }
        });

        currentSection.subSections.forEach(currentSubSection => {
          if (!currentSubSection.id) {
            // New subsection without ID
            newSubSections.push({ subSection: currentSubSection, parentSectionId: currentSection.id! });
            return;
          }

          const originalSubSection = originalSubSectionsMap.get(currentSubSection.id);
          if (!originalSubSection) {
            // New subsection
            newSubSections.push({ subSection: currentSubSection, parentSectionId: currentSection.id! });
          } else {
            // Check if subsection is modified
            if (JSON.stringify(originalSubSection) !== JSON.stringify(currentSubSection)) {
              modifiedSubSections.add(currentSubSection.id);
            }
          }
        });

        // Find removed subsections
        originalSection.subSections.forEach(originalSubSection => {
          if (originalSubSection.id && !currentSection.subSections?.find(s => s.id === originalSubSection.id)) {
            removedSubSections.add(originalSubSection.id);
          }
        });
      }
    }
  });

  // Find removed sections
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