import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { improvementMemories } from '@/app/db/schema';
import { withAuth } from '@/lib/api-helpers';
import { ADMIN_USER_ID } from '@/lib/constants';
import { eq, desc } from 'drizzle-orm';
import { ListImprovementMemoriesResponse, ErrorResponse } from '../types';

export const GET = withAuth(async (_request: NextRequest) => {
  try {
    // Fetch all memories for the admin user, ordered by most recently used
    const memories = await db
      .select()
      .from(improvementMemories)
      .where(eq(improvementMemories.userId, ADMIN_USER_ID))
      .orderBy(desc(improvementMemories.lastUsed));

    return NextResponse.json<ListImprovementMemoriesResponse>({
      success: true,
      memories,
    });
  } catch (error) {
    console.error('Error fetching improvement memories:', error);
    return NextResponse.json<ErrorResponse>(
      { error: 'Failed to fetch improvement memories' },
      { status: 500 }
    );
  }
});
