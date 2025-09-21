import crypto from 'crypto';
import { CACHE_CONFIG } from './cache-config';

// In-memory cache for client-side use (lightweight version)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

/**
 * Generate a deterministic cache key from any object/parameters
 */
export function generateCacheKey(prefix: string, params: any): string {
  // Convert object to deterministic string by sorting keys
  const normalizedParams = JSON.stringify(params, Object.keys(params).sort());

  // Create hash for consistent, short keys
  const hash = crypto.createHash('sha256').update(normalizedParams).digest('hex').substring(0, 16);

  return `${prefix}:${hash}`;
}

/**
 * Set cache entry with TTL
 */
export function setCache(key: string, data: any, ttl: number = CACHE_CONFIG.DEFAULT_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });

  // Log cache set in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🟢 Cache SET: ${key} (TTL: ${ttl/1000}s)`);
  }
}

/**
 * Get cache entry if valid (not expired)
 */
export function getCache<T = any>(key: string): T | null {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  const isExpired = Date.now() - entry.timestamp > entry.ttl;

  if (isExpired) {
    cache.delete(key);
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔴 Cache EXPIRED: ${key}`);
    }
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    const remainingTtl = Math.round((entry.ttl - (Date.now() - entry.timestamp)) / 1000);
    console.log(`🟡 Cache HIT: ${key} (TTL remaining: ${remainingTtl}s)`);
  }

  return entry.data;
}

/**
 * Check if cache entry exists and is valid
 */
export function hasCache(key: string): boolean {
  const entry = cache.get(key);
  if (!entry) return false;

  const isExpired = Date.now() - entry.timestamp > entry.ttl;
  if (isExpired) {
    cache.delete(key);
    return false;
  }

  return true;
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string): void {
  cache.delete(key);
  if (process.env.NODE_ENV === 'development') {
    console.log(`🗑️ Cache CLEARED: ${key}`);
  }
}

/**
 * Clear all cache entries matching a prefix
 */
export function clearCacheByPrefix(prefix: string): void {
  let clearedCount = 0;
  for (const [key] of cache.entries()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
      clearedCount++;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`🗑️ Cache CLEARED: ${clearedCount} entries with prefix "${prefix}"`);
  }
}

/**
 * Cache statistics
 */
export function getCacheStats() {
  let totalSize = 0;
  let expiredCount = 0;
  const now = Date.now();

  for (const entry of cache.values()) {
    totalSize++;
    if (now - entry.timestamp > entry.ttl) {
      expiredCount++;
    }
  }

  return {
    totalEntries: totalSize,
    expiredEntries: expiredCount,
    activeEntries: totalSize - expiredCount
  };
}

/**
 * Cleanup expired cache entries
 */
export function cleanupCache(): void {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > entry.ttl) {
      cache.delete(key);
      cleanedCount++;
    }
  }

  if (process.env.NODE_ENV === 'development' && cleanedCount > 0) {
    console.log(`🧹 Cache CLEANUP: Removed ${cleanedCount} expired entries`);
  }
}

/**
 * Generic cached function wrapper
 */
export async function withCache<T>(
  cacheKey: string,
  fetchFunction: () => Promise<T>,
  ttl: number = CACHE_CONFIG.DEFAULT_TTL
): Promise<T> {
  // Try to get from cache first
  const cached = getCache<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Cache miss - execute function
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔵 Cache MISS: ${cacheKey} - Executing function`);
  }

  const result = await fetchFunction();

  // Store in cache
  setCache(cacheKey, result, ttl);

  return result;
}

// Start cleanup interval
if (typeof window === 'undefined') { // Server-side only
  setInterval(cleanupCache, CACHE_CONFIG.CLEANUP_INTERVAL);
}

export { CACHE_CONFIG };