// Shared job experience data extracted from CV data files
import { cvConfigEn } from './cv/cv-en';
import { cvConfigDa } from './cv/cv-da';
import { cvSv } from './cv/cv-sv';

export interface JobExperience {
  title: string;
  company: string;
  period: string;
  description: string[];
}

// Extract jobs from English CV
export const jobsEn: JobExperience[] = cvConfigEn.mainColumn[1].subSections!.map(job => ({
  title: job.title || '',
  company: job.subtitles?.left || '',
  period: job.subtitles?.right || '',
  description: job.paragraphs?.map((paragraph) => paragraph.text) || []
}));

// Extract jobs from Danish CV
export const jobsDa: JobExperience[] = cvConfigDa.mainColumn[1].subSections!.map(job => ({
  title: job.title || '',
  company: job.subtitles?.left || '',
  period: job.subtitles?.right || '',
  description: job.paragraphs?.map((paragraph) => paragraph.text) || []
}));

// Extract jobs from Swedish CV
export const jobsSv: JobExperience[] = cvSv.mainColumn[1].subSections!.map(job => ({
  title: job.title || '',
  company: job.subtitles?.left || '',
  period: job.subtitles?.right || '',
  description: job.paragraphs?.map((paragraph) => paragraph.text) || []
}));