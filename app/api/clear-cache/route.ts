import { clearCacheByPrefix, getCacheStats } from '@/lib/cache-server'

export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
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

    return new Response(JSON.stringify({
      success: true,
      message: body.prefix
        ? `Cleared cache for prefix: ${body.prefix}`
        : 'Cleared all CV-related cache',
      stats: {
        before: beforeStats,
        after: afterStats
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (e: any) {
    console.error('POST /api/clear-cache - Error:', e)
    return new Response(JSON.stringify({
      error: 'Failed to clear cache',
      details: e.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function GET(req: Request): Promise<Response> {
  try {
    const stats = getCacheStats()

    return new Response(JSON.stringify({
      stats,
      message: 'Cache statistics retrieved successfully'
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (e: any) {
    console.error('GET /api/clear-cache - Error:', e)
    return new Response(JSON.stringify({
      error: 'Failed to get cache stats',
      details: e.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}