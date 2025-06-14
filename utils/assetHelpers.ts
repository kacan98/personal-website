/**
 * Helper to get the correct URL for static assets in public folder
 * Works correctly in both development and production
 */
export const getPublicAssetUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In Next.js, public assets are served from the root
  return `/${cleanPath}`;
};
