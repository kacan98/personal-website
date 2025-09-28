// Simple data exports - no functions, just data
export * from './jobs';
export * from './cv';
export * from './settings';
export * from './socials';
export * from './galleries';
export * from './images';

// Import the data directly
import { cvEn, cvDa, cvSv } from './cv';
import { jobsEn, jobsDa, jobsSv, JobExperience } from './jobs';

// Simple getters that match the locale pattern used elsewhere in the app
export function getCvData(locale: string) {
  switch (locale) {
    case 'da':
      return cvDa;
    case 'sv':
      return cvSv;
    case 'en':
    default:
      return cvEn;
  }
}

// getCvSettings moved to cv-server.ts to avoid fs imports in client-side code

export function getJobsData(locale: string) {
  switch (locale) {
    case 'da':
      return jobsDa;
    case 'sv':
      return jobsSv;
    case 'en':
    default:
      return jobsEn;
  }
}

// Convert jobs to timeline format - simple utility function
export function convertJobsToTimeline(jobs: JobExperience[]) {
  return jobs.map(job => ({
    title: job.title,
    company: job.company,
    period: job.period,
    description: job.description
  }));
}