import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { improvementMemories } from '@/app/db/schema';
import { withAuth } from '@/lib/api-helpers';
import { ADMIN_USER_ID } from '@/lib/constants';
import { eq, and } from 'drizzle-orm';
import { DeleteImprovementMemoryRequest, DeleteImprovementMemoryResponse, ErrorResponse } from '../types';

export const DELETE = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = DeleteImprovementMemoryRequest.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ErrorResponse>(
        { error: `Invalid request: ${validation.error.message}` },
        { status: 400 }
      );
    }

    const { id } = validation.data;

    // Delete the memory (ensure it belongs to admin user for security)
    const [deleted] = await db
      .delete(improvementMemories)
      .where(
        and(
          eq(improvementMemories.id, id),
          eq(improvementMemories.userId, ADMIN_USER_ID)
        )
      )
      .returning();

    if (!deleted) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Memory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<DeleteImprovementMemoryResponse>({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    console.error('Error deleting improvement memory:', error);
    return NextResponse.json<ErrorResponse>(
      { error: 'Failed to delete improvement memory' },
      { status: 500 }
    );
  }
});
