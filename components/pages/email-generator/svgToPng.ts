/**
 * Converts an SVG data URL to a PNG data URL using Canvas
 * @param svgDataUrl - SVG data URL (data:image/svg+xml,...)
 * @param width - Output width in pixels
 * @param height - Output height in pixels
 * @returns Promise that resolves to PNG data URL
 */
export const svgToPngDataUrl = async (
  svgDataUrl: string,
  width: number = 24,
  height: number = 24
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.width = width;
      img.height = height;

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw SVG image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to PNG data URL
        const pngDataUrl = canvas.toDataURL('image/png');
        resolve(pngDataUrl);
      };

      img.onerror = (error) => {
        reject(new Error('Failed to load SVG image: ' + error));
      };

      // Load the SVG
      img.src = svgDataUrl;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Cache for converted PNG icons to avoid re-converting the same icons
 */
const pngIconCache = new Map<string, string>();

/**
 * Converts an SVG icon to PNG with caching
 * @param svgDataUrl - SVG data URL
 * @param width - Width in pixels
 * @param height - Height in pixels
 * @returns Promise that resolves to cached or newly converted PNG data URL
 */
export const getCachedPngIcon = async (
  svgDataUrl: string,
  width: number = 24,
  height: number = 24
): Promise<string> => {
  const cacheKey = `${svgDataUrl}-${width}x${height}`;

  if (pngIconCache.has(cacheKey)) {
    return pngIconCache.get(cacheKey)!;
  }

  const pngDataUrl = await svgToPngDataUrl(svgDataUrl, width, height);
  pngIconCache.set(cacheKey, pngDataUrl);

  return pngDataUrl;
};
