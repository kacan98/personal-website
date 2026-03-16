import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
    OPENAI_API_KEY: z.string().optional(),
    JWT_SECRET: z.string().optional(),
    CV_ADMIN_PASSWORD: z.string().optional(),
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
    NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
    SANITY_API_READ_TOKEN: z.string().optional(),
    NEXT_PUBLIC_GITHUB_REPO: z.string().optional(),
    POSTGRES_CONNECTION_STRING: z.string().optional(),
  })
  .passthrough();

const parsedEnv = envSchema.parse(process.env);

function normalize(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isPlaceholderValue(key: string, value?: string): boolean {
  if (!value) return true;

  const normalized = value.trim().toLowerCase();

  const exactPlaceholders = new Set([
    'your-super-secret-jwt-key-at-least-32-chars',
    'your-admin-password-at-least-8-chars',
    'sk-...',
  ]);

  if (exactPlaceholders.has(normalized)) return true;

  const genericPlaceholderPatterns = [/^your-/, /^example/, /^changeme/, /^replace-me/, /placeholder/];

  if (genericPlaceholderPatterns.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  // Treat obvious bogus values as placeholders for secrets.
  const looksLikeSecret = key.includes('SECRET') || key.includes('PASSWORD') || key.includes('KEY') || key.includes('TOKEN');
  if (looksLikeSecret && normalized.length < 8) {
    return true;
  }

  return false;
}

function readEnv(key: keyof typeof parsedEnv): string | undefined {
  const value = parsedEnv[key];
  return typeof value === 'string' ? normalize(value) : undefined;
}

function requireProtectedSecret(key: keyof typeof parsedEnv, context: string): string {
  const value = readEnv(key);

  if (isPlaceholderValue(String(key), value)) {
    throw new Error(`${String(key)} must be configured with a non-placeholder value before using ${context}.`);
  }

  return value!;
}

// Backwards-compatible exports used across API routes/services
export const OPENAI_API_KEY = isPlaceholderValue('OPENAI_API_KEY', readEnv('OPENAI_API_KEY'))
  ? undefined
  : readEnv('OPENAI_API_KEY');

export const JWT_SECRET = isPlaceholderValue('JWT_SECRET', readEnv('JWT_SECRET')) ? undefined : readEnv('JWT_SECRET');

export const CV_ADMIN_PASSWORD = isPlaceholderValue('CV_ADMIN_PASSWORD', readEnv('CV_ADMIN_PASSWORD'))
  ? undefined
  : readEnv('CV_ADMIN_PASSWORD');

export const SANITY_PROJECT_ID = readEnv('NEXT_PUBLIC_SANITY_PROJECT_ID');
export const SANITY_DATASET = readEnv('NEXT_PUBLIC_SANITY_DATASET');
export const SANITY_API_READ_TOKEN = readEnv('SANITY_API_READ_TOKEN');

export function getJwtSecret(): string {
  return requireProtectedSecret('JWT_SECRET', 'authentication token signing/verification');
}

export function getCvAdminPassword(): string {
  return requireProtectedSecret('CV_ADMIN_PASSWORD', 'CV admin authentication');
}

export function getOpenAIApiKey(): string {
  return requireProtectedSecret('OPENAI_API_KEY', 'OpenAI-powered API endpoints');
}
