// Default configuration for the extension
export const DEFAULT_TARGET_URL =
  process.env.NEXT_PUBLIC_VERCEL_URL
  || process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
  || process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
  || (process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : "")
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
  || "http://localhost:3000";
export const DEFAULT_DEBUG_LOGGING = false;
export const DEFAULT_AUTO_OPEN = false;

// Preset URLs for quick selection in options
export const PRESET_URLS = [
  { label: "Local Development", value: "http://localhost:3000" },
  { label: "Production", value: DEFAULT_TARGET_URL },
];
