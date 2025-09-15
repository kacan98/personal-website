import { getCacheStats } from '@/lib/cache-server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = getCacheStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}