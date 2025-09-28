import { getCvData } from './index';

export async function getCvSettings(locale: string) {
  const cvData = getCvData(locale);

  // Import the cv-projects module dynamically to handle projects section
  const { getCVProjectsSection } = await import('../lib/cv-projects');
  const projectsSection = await getCVProjectsSection(locale);

  // Find and replace the personal-projects section
  const updatedSideColumn = cvData.sideColumn.map(section => {
    if (section.id === 'personal-projects') {
      return projectsSection;
    }
    return section;
  });

  return {
    ...cvData,
    sideColumn: updatedSideColumn
  };
}