/**
 * Centralized environment configuration
 * All environment variables should be accessed through this file
 */

// Single toggle for authentication (works on both client and server)
const dev = process.env.DEV;
export const IS_PRODUCTION = process.env.DEV === '0' || !dev || process.env.DEV === 'false';

// API Keys
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Authentication secrets
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
export const CV_ADMIN_PASSWORD = process.env.CV_ADMIN_PASSWORD;

// Sanity configuration
export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const SANITY_API_READ_TOKEN = process.env.SANITY_API_READ_TOKEN;