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
import { Locale, routing } from '@/i18n/routing';
import { CVSettings, CVSettingsSchema } from '@/types';

// Locale-to-CV data mapping
const cvDataByLocale = {
  en: cvEn,
  da: cvDa,
  sv: cvSv,
} as const;

// Parse CV data immediately on load - data is always returned as CVSettings (fully parsed)
export function getCvData(locale: string): CVSettings {
  // Validate locale and fallback to default
  const validLocale = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale as Locale;

  // Parse through Zod to fill in default null values
  return CVSettingsSchema.parse(cvDataByLocale[validLocale]);
}

// getCvSettings moved to cv-server.ts to avoid fs imports in client-side code

// Locale-to-jobs data mapping
const jobsDataByLocale: Record<Locale, JobExperience[]> = {
  en: jobsEn,
  da: jobsDa,
  sv: jobsSv,
};

export function getJobsData(locale: string): JobExperience[] {
  // Validate locale and fallback to default
  const validLocale = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale as Locale;

  return jobsDataByLocale[validLocale];
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