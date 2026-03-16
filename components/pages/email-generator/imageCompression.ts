/**
 * Compresses an image to a smaller size suitable for Gmail signatures
 * @param base64Image - The base64 image string
 * @param maxSize - Maximum width/height in pixels (default 60)
 * @param quality - JPEG quality 0-1 (default 0.8)
 * @param backgroundColor - Background color for JPEG (default white)
 * @returns Compressed base64 image string
 */
export const compressImageForGmail = async (
  base64Image: string,
  maxSize: number = 60,
  quality: number = 0.8,
  backgroundColor: string = '#FFFFFF'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create an image element
      const img = new Image();

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate new dimensions (maintain aspect ratio)
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Fill background (for JPEG - no transparency)
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Load the image
      img.src = base64Image;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Estimates the size of a base64 string in KB
 */
export const estimateBase64Size = (base64String: string): number => {
  // Remove data URL prefix if present
  const base64Data = base64String.split(',')[1] || base64String;

  // Base64 encoding increases size by ~33%, so decode size is roughly:
  const sizeInBytes = (base64Data.length * 3) / 4;
  const sizeInKB = sizeInBytes / 1024;

  return Math.round(sizeInKB * 100) / 100; // Round to 2 decimals
};
