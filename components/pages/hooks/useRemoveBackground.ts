import { useState } from 'react';
import { removeBackground } from '@imgly/background-removal';

interface UseRemoveBackgroundReturn {
  removingBackground: boolean;
  backgroundRemovalStatus: string;
  backgroundRemovalProgress: number;
  backgroundRemovalError: string;
  removeBackgroundFromImage: (imageData: string) => Promise<string | null>;
}

/**
 * Custom hook for removing backgrounds from images using AI
 * Shared between BackgroundRemovalPageContent and ImageUpload components
 */
export const useRemoveBackground = (): UseRemoveBackgroundReturn => {
  const [removingBackground, setRemovingBackground] = useState(false);
  const [backgroundRemovalStatus, setBackgroundRemovalStatus] = useState('');
  const [backgroundRemovalProgress, setBackgroundRemovalProgress] = useState(0);
  const [backgroundRemovalError, setBackgroundRemovalError] = useState('');

  const removeBackgroundFromImage = async (imageData: string): Promise<string | null> => {
    if (!imageData) return null;

    setRemovingBackground(true);
    setBackgroundRemovalProgress(0);
    setBackgroundRemovalStatus('Preparing image...');
    setBackgroundRemovalError('');

    try {
      const blob = await fetch(imageData).then((r) => r.blob());

      setBackgroundRemovalProgress(10);
      setBackgroundRemovalStatus('Downloading AI model (first time only, ~50MB)...');

      // Improved simulated progress - continuously moves forward
      let simulatedProgress = 10;
      let progressSpeed = 1; // Start slow
      const progressInterval = setInterval(() => {
        if (simulatedProgress < 30) {
          progressSpeed = 1; // Slow at start
        } else if (simulatedProgress < 60) {
          progressSpeed = 0.5; // Slower in middle
        } else {
          progressSpeed = 0.3; // Very slow near end
        }

        simulatedProgress += progressSpeed;
        if (simulatedProgress <= 85) {
          setBackgroundRemovalProgress(Math.floor(simulatedProgress));
        }
      }, 500); // Update every 500ms for smoother progress

      const callbackTriggered = false;

      const result = await removeBackground(blob, {
        proxyToWorker: true, // IMPORTANT: Run in web worker to prevent UI freeze
      });

      clearInterval(progressInterval);

      setBackgroundRemovalProgress(95);
      setBackgroundRemovalStatus('Finishing up...');

      // Convert result to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setBackgroundRemovalProgress(100);
          setBackgroundRemovalStatus('Complete!');
          setTimeout(() => {
            setRemovingBackground(false);
            setBackgroundRemovalStatus('');
            setBackgroundRemovalProgress(0);
          }, 1000);
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(result);
      });
    } catch (error) {
      console.error('Failed to remove background:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setBackgroundRemovalError(
        `Failed: ${errorMessage}. This feature requires internet connection to download the AI model (~50MB first time).`
      );
      setRemovingBackground(false);
      setBackgroundRemovalStatus('');
      setBackgroundRemovalProgress(0);
      return null;
    }
  };

  return {
    removingBackground,
    backgroundRemovalStatus,
    backgroundRemovalProgress,
    backgroundRemovalError,
    removeBackgroundFromImage,
  };
};
