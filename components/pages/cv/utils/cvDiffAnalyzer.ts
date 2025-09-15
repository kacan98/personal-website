import { CVSettings } from '@/types';

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

  // Helper function to generate section key
  const getSectionKey = (columnType: 'mainColumn' | 'sideColumn', index: number, sectionId?: string) => {
    return sectionId || `${columnType}-${index}`;
  };

  // Helper function to find section by ID in array
  const findSectionById = (sections: any[], sectionId: string) => {
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

      if (!currentSection || !currentSection.title || currentSection.title.trim() === '') {
        // Section is missing or empty - consider it removed
        analysis.removedSections.add(sectionId);
        analysis.hasChanges = true;
      } else {
        // Check if section content has actually changed (more granular than full JSON comparison)
        const hasContentChanges = (
          originalSection.title !== currentSection.title ||
          JSON.stringify(originalSection.paragraphs || []) !== JSON.stringify(currentSection.paragraphs || []) ||
          JSON.stringify(originalSection.bulletPoints || []) !== JSON.stringify(currentSection.bulletPoints || []) ||
          JSON.stringify(originalSection.subtitles || {}) !== JSON.stringify(currentSection.subtitles || {}) ||
          JSON.stringify(originalSection.subSections || []) !== JSON.stringify(currentSection.subSections || [])
        );

        if (hasContentChanges) {
          // Section exists but content is different - consider it modified
          analysis.modifiedSections.add(sectionId);
          analysis.hasChanges = true;
        }

        // Check subsections if they exist
        if (originalSection.subSections && currentSection.subSections) {
          originalSection.subSections.forEach((originalSubSection, subIndex) => {
            const subSectionId = originalSubSection.id || `${sectionId}-sub-${subIndex}`;

            // Try to find matching subsection by ID first, then by index as fallback
            const currentSubSection = originalSubSection.id
              ? currentSection.subSections?.find((sub: any) => sub.id === originalSubSection.id)
              : currentSection.subSections?.[subIndex];

            if (!currentSubSection || !currentSubSection.title || currentSubSection.title.trim() === '') {
              analysis.removedSubSections.add(subSectionId);
            } else if (JSON.stringify(originalSubSection) !== JSON.stringify(currentSubSection)) {
              analysis.modifiedSubSections.add(subSectionId);
            }
          });
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
  originalSections: any[],
  currentSections: any[],
  columnType: 'mainColumn' | 'sideColumn'
) {
  const merged: Array<{
    section: any;
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
    const sectionId = getSectionKey(columnType, index);
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
      const sectionId = getSectionKey(columnType, index);
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
export function useCvDiffAnalysis(originalCv: CVSettings | null, currentCv: CVSettings): CvDiffAnalysis {
  return analyzeCvDifferences(originalCv, currentCv);
}