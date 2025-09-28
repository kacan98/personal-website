import { clearCacheByPrefix, getCacheStats } from '@/lib/cache-server'
import { withAuth, ApiResponse } from '../lib/withAuth'

export const runtime = 'nodejs';

export const POST = withAuth(async (req: Request, _auth) => {
  try {
    console.log('POST /api/clear-cache - Request received')

    let body: { prefix?: string } = {}
    try {
      body = await req.json()
    } catch (e) {
      // If no body, clear all cache
    }

    const beforeStats = getCacheStats()

    if (body.prefix) {
      clearCacheByPrefix(body.prefix)
      console.log(`POST /api/clear-cache - Cleared cache for prefix: ${body.prefix}`)
    } else {
      // Clear all CV-related cache
      clearCacheByPrefix('personalize-cv:')
      clearCacheByPrefix('position-summary:')
      clearCacheByPrefix('motivational-letter:')
      clearCacheByPrefix('job-cv-intersection:')
      console.log('POST /api/clear-cache - Cleared all CV-related cache')
    }

    const afterStats = getCacheStats()

    return ApiResponse.success({
      success: true,
      message: body.prefix
        ? `Cleared cache for prefix: ${body.prefix}`
        : 'Cleared all CV-related cache',
      stats: {
        before: beforeStats,
        after: afterStats
      }
    })

  } catch (e: any) {
    console.error('POST /api/clear-cache - Error:', e)
    return ApiResponse.error('Failed to clear cache: ' + e.message, 500)
  }
});

export const GET = withAuth(async (_req: Request, _auth) => {
  try {
    const stats = getCacheStats()

    return ApiResponse.success({
      stats,
      message: 'Cache statistics retrieved successfully'
    })
  } catch (e: any) {
    console.error('GET /api/clear-cache - Error:', e)
    return ApiResponse.error('Failed to get cache stats: ' + e.message, 500)
  }
});