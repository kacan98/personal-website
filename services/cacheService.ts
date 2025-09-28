/**
 * Service for managing AI cache operations
 */
export interface CacheStats {
  activeEntries: number;
  cvActiveEntries: number;
}

export class CacheService {
  /**
   * Fetches current cache statistics
   */
  static async fetchCacheStats(): Promise<CacheStats | null> {
    try {
      const response = await fetch('/api/cache-stats');
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching cache stats:', error);
      return null;
    }
  }

  /**
   * Clears the AI cache
   */
  static async clearCache(): Promise<{
    success: boolean;
    message: string;
    result?: any;
  }> {
    try {
      const response = await fetch('/api/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: '✅ Cache cleared successfully. Refresh page to see fresh AI results.',
          result
        };
      } else {
        return {
          success: false,
          message: '❌ Failed to clear cache'
        };
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      return {
        success: false,
        message: '❌ Error clearing cache'
      };
    }
  }
}

/**
 * Hook for using cache service in components
 */
export function useCacheService() {
  /**
   * Fetches cache stats and updates state
   */
  const fetchCacheStats = async (
    setCacheStats: (stats: CacheStats | null) => void
  ) => {
    const stats = await CacheService.fetchCacheStats();
    setCacheStats(stats);
  };

  /**
   * Clears cache and provides user feedback
   */
  const clearCache = async (
    setClearingCache: (loading: boolean) => void,
    setSnackbarMessage: (message: string) => void,
    onCacheCleared?: () => void
  ) => {
    setClearingCache(true);

    try {
      const result = await CacheService.clearCache();
      setSnackbarMessage(result.message);

      if (result.success && onCacheCleared) {
        onCacheCleared();
      }
    } finally {
      setClearingCache(false);
    }
  };

  return {
    fetchCacheStats,
    clearCache
  };
}