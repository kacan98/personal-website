type SoundEffectPaths = string[];

/**
 * Try to load with different audio formats
 * This helps with browser compatibility
 */
const tryPlayAudio = (path: string, volume = 0.5): void => {
  try {
    // Create a fresh audio element for each play to avoid conflicts
    const audio = new Audio();

    // Set volume before loading
    audio.volume = volume;

    // Set load event to play when ready
    audio.addEventListener('canplaythrough', () => {
      // Try to play and handle errors silently
      audio.play().catch(() => {
        // Try MP3 fallback if OGG fails
        if (path.toLowerCase().endsWith('.ogg')) {
          const mp3Path = path.substring(0, path.lastIndexOf('.')) + '.mp3';
          const fallbackAudio = new Audio(mp3Path);
          fallbackAudio.volume = volume;
          fallbackAudio.play().catch(() => {
            // Silent fail for fallback
          });
        }
      });
    }, { once: true });

    // Set error handler
    audio.addEventListener('error', () => {
      // Try MP3 fallback if OGG fails
      if (path.toLowerCase().endsWith('.ogg')) {
        const mp3Path = path.substring(0, path.lastIndexOf('.')) + '.mp3';
        const fallbackAudio = new Audio(mp3Path);
        fallbackAudio.volume = volume;
        fallbackAudio.play().catch(() => {
          // Silent fail for fallback
        });
      }
    }, { once: true });

    // Start loading
    audio.src = path;
    audio.load();
  } catch (error) {
    // Completely silent fail
  }
};

/**
 * Custom hook for managing sound effects
 * No preloading, just play on demand with fallbacks
 */
export const useSoundEffects = (soundPaths: SoundEffectPaths) => {
  // Function to play a random sound
  const playRandomSound = () => {
    if (!soundPaths.length) return;

    try {
      // Get a random sound path
      const randomIndex = Math.floor(Math.random() * soundPaths.length);
      const soundPath = soundPaths[randomIndex];

      // Try to play it
      tryPlayAudio(soundPath, 0.5);
    } catch (error) {
      // Silent fail
    }
  };

  return { playRandomSound };
};