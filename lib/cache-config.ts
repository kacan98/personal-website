// Shared cache configuration for both client and server
export const CACHE_CONFIG = {
  // Default TTL: 24 hours for most API calls
  DEFAULT_TTL: 24 * 60 * 60 * 1000,

  // Specific TTL for different endpoints (all set to 24 hours)
  PERSONALIZE_CV: 24 * 60 * 60 * 1000, // 24 hours - CV personalization
  POSITION_SUMMARY: 24 * 60 * 60 * 1000, // 24 hours - position analysis
  JOB_INTERSECTION: 24 * 60 * 60 * 1000, // 24 hours - job-CV intersection analysis
  MOTIVATIONAL_LETTER: 24 * 60 * 60 * 1000, // 24 hours - motivational letters

  // Cache cleanup interval (every 2 hours)
  CLEANUP_INTERVAL: 2 * 60 * 60 * 1000,
};