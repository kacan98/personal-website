import { CVSettings, CvSection } from '@/types';

export interface TextChange {
  type: 'added' | 'removed' | 'modified';
  originalText?: string;
  newText?: string;
  path: string[]; // e.g., ['mainColumn', 0, 'paragraphs', 0]
}

export interface CvChangeTracker {
  originalCv: CVSettings | null;
  changes: TextChange[];
}

/**
 * Deep clone function for CV data
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

/**
 * Compare two text arrays and return changes
 */
export function compareTextArrays(
  original: string[] | undefined,
  modified: string[] | undefined,
  basePath: string[]
): TextChange[] {
  const changes: TextChange[] = [];
  
  if (!original && !modified) return changes;
  
  const originalTexts = original || [];
  const modifiedTexts = modified || [];
  
  // Check for modifications and removals
  originalTexts.forEach((origText, index) => {
    const modText = modifiedTexts[index];
    const path = [...basePath, index.toString()];
    
    if (!modText) {
      // Text was removed
      changes.push({
        type: 'removed',
        originalText: origText,
        path
      });
    } else if (origText !== modText) {
      // Text was modified
      changes.push({
        type: 'modified',
        originalText: origText,
        newText: modText,
        path
      });
    }
  });
  
  // Check for additions
  if (modifiedTexts.length > originalTexts.length) {
    for (let i = originalTexts.length; i < modifiedTexts.length; i++) {
      changes.push({
        type: 'added',
        newText: modifiedTexts[i],
        path: [...basePath, i.toString()]
      });
    }
  }
  
  return changes;
}

/**
 * Compare two CV sections and return all text changes
 */
export function compareCvSections(
  originalSection: CvSection | undefined,
  modifiedSection: CvSection | undefined,
  sectionPath: string[]
): TextChange[] {
  const changes: TextChange[] = [];
  
  if (!originalSection && !modifiedSection) return changes;
  
  const orig = originalSection || {} as CvSection;
  const mod = modifiedSection || {} as CvSection;
  
  // Compare title
  if (orig.title !== mod.title) {
    changes.push({
      type: 'modified',
      originalText: orig.title,
      newText: mod.title,
      path: [...sectionPath, 'title']
    });
  }
  
  // Compare subtitles
  if (orig.subtitles?.left !== mod.subtitles?.left) {
    changes.push({
      type: 'modified',
      originalText: orig.subtitles?.left,
      newText: mod.subtitles?.left,
      path: [...sectionPath, 'subtitles', 'left']
    });
  }
  
  if (orig.subtitles?.right !== mod.subtitles?.right) {
    changes.push({
      type: 'modified',
      originalText: orig.subtitles?.right,
      newText: mod.subtitles?.right,
      path: [...sectionPath, 'subtitles', 'right']
    });
  }
  
  // Compare paragraphs
  changes.push(...compareTextArrays(
    orig.paragraphs,
    mod.paragraphs,
    [...sectionPath, 'paragraphs']
  ));
  
  // Compare bullet points
  const origBulletTexts = orig.bulletPoints?.map(bp => bp.text) || [];
  const modBulletTexts = mod.bulletPoints?.map(bp => bp.text) || [];
  changes.push(...compareTextArrays(
    origBulletTexts,
    modBulletTexts,
    [...sectionPath, 'bulletPoints']
  ));
  
  // Compare subsections
  if (orig.subSections && mod.subSections) {
    orig.subSections.forEach((origSub, index) => {
      const modSub = mod.subSections?.[index];
      changes.push(...compareCvSections(
        origSub,
        modSub,
        [...sectionPath, 'subSections', index.toString()]
      ));
    });
  }
  
  return changes;
}

/**
 * Compare two complete CVs and return all changes
 */
export function compareCvs(originalCv: CVSettings, modifiedCv: CVSettings): TextChange[] {
  const changes: TextChange[] = [];
  
  // Compare main column sections
  if (originalCv.mainColumn && modifiedCv.mainColumn) {
    originalCv.mainColumn.forEach((origSection, index) => {
      const modSection = modifiedCv.mainColumn?.[index];
      changes.push(...compareCvSections(
        origSection,
        modSection,
        ['mainColumn', index.toString()]
      ));
    });
  }
  
  // Compare side column sections
  if (originalCv.sideColumn && modifiedCv.sideColumn) {
    originalCv.sideColumn.forEach((origSection, index) => {
      const modSection = modifiedCv.sideColumn?.[index];
      changes.push(...compareCvSections(
        origSection,
        modSection,
        ['sideColumn', index.toString()]
      ));
    });
  }
  
  return changes;
}

/**
 * Check if a specific text path has been modified
 */
export function isTextModified(changes: TextChange[] | undefined, path: string[]): TextChange | null {
  if (!changes || !Array.isArray(changes)) {
    return null;
  }
  
  return changes.find(change => 
    change.path.length === path.length &&
    change.path.every((segment, index) => segment === path[index])
  ) || null;
}
