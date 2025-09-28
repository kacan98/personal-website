import { apiClient } from './apiClient';
import { CVSettings } from '@/types';
import { JobCvIntersectionResponse } from '@/app/api/job-cv-intersection/model';
import { MotivationalLetterParams, MotivationalLetterResponse } from '@/app/api/motivational-letter/motivational-letter.model';
import { CvUpgradeResponse } from '@/app/api/personalize-cv/model';

/**
 * CV-specific API client methods
 * Centralizes all CV-related API calls
 */
export class CvApiClient {
  /**
   * Personalizes CV for a specific position
   */
  static async personalizeCV(params: {
    cvBody: CVSettings;
    positionWeAreApplyingFor: string;
    positionSummary?: string | null;
    positionIntersection?: JobCvIntersectionResponse | null;
  }) {
    return apiClient.requestWithCacheInfo<CvUpgradeResponse>(
      '/personalize-cv',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  }

  /**
   * Generates motivational letter
   */
  static async generateMotivationalLetter(params: MotivationalLetterParams) {
    return apiClient.requestWithCacheInfo<MotivationalLetterResponse>(
      '/motivational-letter',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  }

  /**
   * Adjusts motivational letter based on feedback
   */
  static async adjustMotivationalLetter(params: {
    currentLetter: MotivationalLetterResponse;
    adjustmentComments: string;
    jobDescription: string;
    candidate: CVSettings;
    language: string;
  }) {
    return apiClient.post<MotivationalLetterResponse>(
      '/motivational-letter/adjust',
      params
    );
  }

  /**
   * Translates CV to specified language
   */
  static async translateCV(params: {
    cvProps: CVSettings;
    selectedLanguage: string;
  }) {
    return apiClient.post<CVSettings>('/translate/cv', params);
  }

  /**
   * Translates motivational letter
   */
  static async translateLetter(params: {
    letter: MotivationalLetterResponse;
    selectedLanguage: string;
  }) {
    return apiClient.post<MotivationalLetterResponse>('/translate/letter', params);
  }

  /**
   * Gets job-CV intersection analysis
   */
  static async getJobCvIntersection(params: {
    cvProps: CVSettings;
    positionDetails: string;
    companyName?: string | null;
  }) {
    return apiClient.requestWithCacheInfo<JobCvIntersectionResponse>(
      '/job-cv-intersection',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  }

  /**
   * Gets position summary
   */
  static async getPositionSummary(params: {
    positionDetails: string;
  }) {
    return apiClient.requestWithCacheInfo<{
      positionSummary: string;
      companyName: string | null;
      languagePostIsWrittenIn: string;
    }>('/position-summary', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Adjusts specific CV section
   */
  static async adjustSection(params: {
    positionDescription: string;
    section: any;
    sectionType?: string;
  }) {
    return apiClient.post('/adjust-section', params);
  }

  /**
   * Refines CV based on feedback
   */
  static async refineCv(params: {
    currentCv: CVSettings;
    originalCv: CVSettings;
    positionDetails: string;
    checkedImprovements: string[];
    improvementInputs: Record<string, string>;
    missingSkills: string;
    otherChanges: string;
  }) {
    return apiClient.post<CVSettings>('/refine-cv', params);
  }

  /**
   * Auto-fills improvements
   */
  static async autoFillImprovements(params: {
    newImprovements: string[];
    currentCv: CVSettings;
  }) {
    return apiClient.post('/auto-fill-improvements', params);
  }

  /**
   * Fetches CV settings for a locale
   */
  static async getCvSettings(locale: string) {
    return apiClient.get<CVSettings>(`/cv/settings?locale=${locale}`);
  }

  /**
   * Ranks stories for position
   */
  static async rankStories(params: {
    positionDetails: string;
    selectedProjects?: string[];
  }) {
    return apiClient.post('/stories/rank', params);
  }
}

/**
 * Hook for using CV API client in components
 */
export function useCvApiClient() {
  return CvApiClient;
}