import { CVSettings, CvSection, CvSubSection } from '@/types';

export interface CvDiffAnalysis {
  removedSections: Set<string>;
  modifiedSections: Set<string>;
  removedSubSections: Set<string>;
  modifiedSubSections: Set<string>;
  hasChanges: boolean;
}

/**
 * Analyzes differences between original CV and current CV state
 * Returns which sections/subsections have been removed or modified
 */
export function analyzeCvDifferences(
  originalCv: CVSettings | null,
  currentCv: CVSettings
): CvDiffAnalysis {
  const analysis: CvDiffAnalysis = {
    removedSections: new Set<string>(),
    modifiedSections: new Set<string>(),
    removedSubSections: new Set<string>(),
    modifiedSubSections: new Set<string>(),
    hasChanges: false,
  };

  if (!originalCv) {
    return analysis;
  }

  // Quick check for basic properties that should be identical initially
  const basicFieldsChanged = (
    originalCv.name !== currentCv.name ||
    originalCv.subtitle !== currentCv.subtitle ||
    originalCv.profilePicture !== currentCv.profilePicture
  );

  if (basicFieldsChanged) {
    analysis.hasChanges = true;
  }

  // Helper function to generate section key
  const getSectionKey = (columnType: 'mainColumn' | 'sideColumn', index: number, sectionId?: string) => {
    return sectionId || `${columnType}-${index}`;
  };

  // Helper function to find section by ID in array
  const findSectionById = (sections: CvSection[], sectionId: string) => {
    return sections.find(section => section.id === sectionId);
  };

  // Process both columns
  const columnTypes: ('mainColumn' | 'sideColumn')[] = ['mainColumn', 'sideColumn'];

  columnTypes.forEach(columnType => {
    const originalSections = originalCv[columnType] || [];
    const currentSections = currentCv[columnType] || [];

    // Check each original section
    originalSections.forEach((originalSection, index) => {
      const sectionId = originalSection.id || getSectionKey(columnType, index);

      // Try to find matching section by ID first, then by index as fallback
      const currentSection = originalSection.id
        ? findSectionById(currentSections, originalSection.id)
        : currentSections[index];

      if (!currentSection) {
        // Section completely missing - consider it removed
        analysis.removedSections.add(sectionId);
        analysis.hasChanges = true;
      } else {
        // Section exists - check if it has any content (title, paragraphs, bullet points, or subsections)
        const hasTitle = currentSection.title && currentSection.title.trim() !== '';
        const hasParagraphs = currentSection.paragraphs && currentSection.paragraphs.some((p: string) => p && p.trim() !== '');
        const hasBulletPoints = currentSection.bulletPoints && currentSection.bulletPoints.some((bp: any) => bp.text && bp.text.trim() !== '');
        const hasSubSections = currentSection.subSections && currentSection.subSections.length > 0;

        const hasAnyContent = hasTitle || hasParagraphs || hasBulletPoints || hasSubSections;

        if (!hasAnyContent) {
          // Section exists but is completely empty - consider it removed
          analysis.removedSections.add(sectionId);
          analysis.hasChanges = true;
        } else {
        // Check if section content has actually changed (more granular than full JSON comparison)
        // Normalize sections by removing/ignoring IDs for comparison to avoid false positives
        const normalizeSection = (section: any) => {
          const { id: _id, ...rest } = section;
          return rest;
        };

        const normalizedOriginal = normalizeSection(originalSection);
        const normalizedCurrent = normalizeSection(currentSection);

        const hasContentChanges = JSON.stringify(normalizedOriginal) !== JSON.stringify(normalizedCurrent);

        if (hasContentChanges) {
          // Section exists but content is different - consider it modified
          analysis.modifiedSections.add(sectionId);
          analysis.hasChanges = true;

          // Debug logging removed to reduce console spam
        }

        // Check subsections if they exist
        if (originalSection.subSections && currentSection.subSections) {
          originalSection.subSections.forEach((originalSubSection, subIndex) => {
            const subSectionId = originalSubSection.id || `${sectionId}-sub-${subIndex}`;

            // Try to find matching subsection by ID first, then by index as fallback
            const currentSubSection = originalSubSection.id
              ? currentSection.subSections?.find((sub: CvSubSection) => sub.id === originalSubSection.id)
              : currentSection.subSections?.[subIndex];

            if (!currentSubSection || !currentSubSection.title || currentSubSection.title.trim() === '') {
              analysis.removedSubSections.add(subSectionId);
            } else if (JSON.stringify(originalSubSection) !== JSON.stringify(currentSubSection)) {
              analysis.modifiedSubSections.add(subSectionId);
            }
          });
        }
        }
      }
    });
  });

  return analysis;
}

/**
 * Creates a merged list of sections for rendering, including deleted sections
 */
export function getMergedSectionsForRendering(
  originalSections: CvSection[],
  currentSections: CvSection[],
  columnType: 'mainColumn' | 'sideColumn'
) {
  const merged: Array<{
    section: CvSection;
    sectionId: string;
    isDeleted: boolean;
    isFromOriginal: boolean;
  }> = [];

  // Helper function to generate section key
  const getSectionKey = (columnType: 'mainColumn' | 'sideColumn', index: number, sectionId?: string) => {
    return sectionId || `${columnType}-${index}`;
  };

  // Create a map of current sections by ID for quick lookup
  const currentSectionsById = new Map<string, any>();
  const currentSectionsByIndex = new Map<number, any>();

  currentSections.forEach((section, index) => {
    if (section.id) {
      currentSectionsById.set(section.id, section);
    }
    currentSectionsByIndex.set(index, section);
  });

  // Simple index-based approach: add all current sections
  currentSections.forEach((section, index) => {
    const sectionId = section.id || getSectionKey(columnType, index);
    merged.push({
      section,
      sectionId,
      isDeleted: false,
      isFromOriginal: false
    });
  });

  // Add any original sections that were deleted (exist in original but not at same index in current)
  originalSections.forEach((originalSection, index) => {
    // If current sections is shorter, these sections were deleted
    if (index >= currentSections.length) {
      const sectionId = originalSection.id || getSectionKey(columnType, index);
      merged.push({
        section: originalSection,
        sectionId,
        isDeleted: true,
        isFromOriginal: true
      });
    }
  });

  return merged;
}

/**
 * Hook that provides CV diff analysis using current Redux state
 */
export function useCvDiffAnalysis(originalCv: CVSettings | null, currentCv: CVSettings | null): CvDiffAnalysis {
  if (!currentCv) {
    return {
      removedSections: new Set<string>(),
      modifiedSections: new Set<string>(),
      removedSubSections: new Set<string>(),
      modifiedSubSections: new Set<string>(),
      hasChanges: false,
    };
  }
  return analyzeCvDifferences(originalCv, currentCv);
}