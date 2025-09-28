import { useCallback, useEffect, useRef } from 'react';
import { useCacheService } from '@/services/cacheService';

interface CacheManagementConfig {
  setCacheStats: (stats: any) => void;
  setClearingCache: (clearing: boolean) => void;
  clearingCache: boolean;
  setSnackbarMessage: (message: string) => void;
  setCacheStatusNotification: (notification: any) => void;
  setLastCacheStatus: (status: boolean | null) => void;
}

/**
 * Hook to manage cache operations and status
 * Separates caching logic from main component
 */
export function useCacheManagement(config: CacheManagementConfig) {
  const { fetchCacheStats, clearCache } = useCacheService();
  const wasClearingRef = useRef(false);

  const handleFetchCacheStats = useCallback(async () => {
    await fetchCacheStats(config.setCacheStats);
  }, [fetchCacheStats, config.setCacheStats]);

  const handleClearCache = useCallback(async () => {
    wasClearingRef.current = true;
    await clearCache(
      config.setClearingCache,
      config.setSnackbarMessage,
      () => {
        config.setCacheStatusNotification(null);
        config.setLastCacheStatus(null);
      }
    );
  }, [clearCache, config]);

  // Watch for when cache clearing is completed and refresh stats
  useEffect(() => {
    if (wasClearingRef.current && !config.clearingCache) {
      // Cache clearing just completed, refresh stats
      wasClearingRef.current = false;
      handleFetchCacheStats();
    }
  }, [config.clearingCache, handleFetchCacheStats]);

  const setCacheStatus = useCallback((fromCache: boolean) => {
    config.setCacheStatusNotification({ show: true, fromCache });
    config.setLastCacheStatus(fromCache);
    handleFetchCacheStats();
    setTimeout(() => {
      config.setCacheStatusNotification(null);
    }, 5000);
  }, [config, handleFetchCacheStats]);

  return {
    handleFetchCacheStats,
    handleClearCache,
    setCacheStatus,
  };
}