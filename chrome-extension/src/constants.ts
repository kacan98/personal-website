// Default configuration for the extension
export const DEFAULT_TARGET_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const DEFAULT_DEBUG_LOGGING = false;
export const DEFAULT_AUTO_OPEN = false;

// Preset URLs for quick selection in options
export const PRESET_URLS = [
  { label: "Local Development", value: "http://localhost:3000" },
  { label: "Production", value: DEFAULT_TARGET_URL },
];