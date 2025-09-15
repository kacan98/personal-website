import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// File-based cache for development persistence - SERVER ONLY
const CACHE_DIR = path.join(process.cwd(), '.next', 'cache-data');
const CACHE_FILE = path.join(CACHE_DIR, 'api-cache.json');

// Ensure cache directory exists
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
} catch (error) {
  console.warn('Failed to create cache directory:', error);
}

// Load existing cache from file
let cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

try {
  if (fs.existsSync(CACHE_FILE)) {
    const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    cache = new Map(Object.entries(cacheData));
    if (process.env.NODE_ENV === 'development') {
      console.log(`🟢 Loaded ${cache.size} cached entries from file`);
    }
  }
} catch (error) {
  console.warn('Failed to load cache from file:', error);
}

// Debounced save function to avoid excessive file writes
let saveTimeout: NodeJS.Timeout | null = null;
const saveCacheToFile = () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    try {
      const cacheObj = Object.fromEntries(cache.entries());
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheObj, null, 2));
      if (process.env.NODE_ENV === 'development') {
        console.log(`💾 Saved ${cache.size} cache entries to file`);
      }
    } catch (error) {
      console.warn('Failed to save cache to file:', error);
    }
  }, 1000); // Debounce by 1 second
};

// Cache configuration
export const CACHE_CONFIG = {
  // Default TTL: 1 hour for most API calls
  DEFAULT_TTL: 60 * 60 * 1000,

  // Specific TTL for different endpoints
  PERSONALIZE_CV: 2 * 60 * 60 * 1000, // 2 hours - CV personalization changes less frequently
  POSITION_SUMMARY: 4 * 60 * 60 * 1000, // 4 hours - position analysis is quite stable
  JOB_INTERSECTION: 2 * 60 * 60 * 1000, // 2 hours - job-CV intersection analysis
  MOTIVATIONAL_LETTER: 1 * 60 * 60 * 1000, // 1 hour - letters may need more frequent updates

  // Cache cleanup interval (every 30 minutes)
  CLEANUP_INTERVAL: 30 * 60 * 1000,
};

/**
 * Generate a deterministic cache key from any object/parameters
 */
export function generateCacheKey(prefix: string, params: object): string {
  // Convert object to deterministic string by sorting keys
  const normalizedParams = JSON.stringify(params, Object.keys(params).sort());

  // Create hash for consistent, short keys
  const hash = crypto.createHash('sha256').update(normalizedParams).digest('hex').substring(0, 16);

  return `${prefix}:${hash}`;
}

/**
 * Set cache entry with TTL
 */
export function setCache(key: string, data: unknown, ttl: number = CACHE_CONFIG.DEFAULT_TTL): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });

  // Save to file (debounced)
  saveCacheToFile();

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
    saveCacheToFile();
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔴 Cache EXPIRED: ${key}`);
    }
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    const remainingTtl = Math.round((entry.ttl - (Date.now() - entry.timestamp)) / 1000);
    console.log(`🟡 Cache HIT: ${key} (TTL remaining: ${remainingTtl}s)`);
  }

  return entry.data as T;
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
    saveCacheToFile();
    return false;
  }

  return true;
}

/**
 * Clear specific cache entry
 */
export function clearCache(key: string): void {
  cache.delete(key);
  saveCacheToFile();
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

  if (clearedCount > 0) {
    saveCacheToFile();
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

  if (cleanedCount > 0) {
    saveCacheToFile();
  }

  if (process.env.NODE_ENV === 'development' && cleanedCount > 0) {
    console.log(`🧹 Cache CLEANUP: Removed ${cleanedCount} expired entries`);
  }
}

/**
 * Generic cached function wrapper with cache status
 */
export async function withCacheStatus<T>(
  cacheKey: string,
  fetchFunction: () => Promise<T>,
  ttl: number = CACHE_CONFIG.DEFAULT_TTL
): Promise<{ data: T; fromCache: boolean }> {
  // Try to get from cache first
  const cached = getCache<T>(cacheKey);
  if (cached !== null) {
    return { data: cached, fromCache: true };
  }

  // Cache miss - execute function
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔵 Cache MISS: ${cacheKey} - Executing function`);
  }

  const result = await fetchFunction();

  // Store in cache
  setCache(cacheKey, result, ttl);

  return { data: result, fromCache: false };
}

/**
 * Generic cached function wrapper (legacy - returns data only)
 */
export async function withCache<T>(
  cacheKey: string,
  fetchFunction: () => Promise<T>,
  ttl: number = CACHE_CONFIG.DEFAULT_TTL
): Promise<T> {
  const result = await withCacheStatus(cacheKey, fetchFunction, ttl);
  return result.data;
}

// Start cleanup interval
setInterval(cleanupCache, CACHE_CONFIG.CLEANUP_INTERVAL);