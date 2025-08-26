// Import CV data from centralized data folder
import { cvConfigEn } from './cv/cv-en';
import { cvConfigDa } from './cv/cv-da';
import { cvSv as cvConfigSv } from './cv/cv-sv';

// Re-export as simpler names
export const cvEn = cvConfigEn;
export const cvDa = cvConfigDa;
export const cvSv = cvConfigSv;