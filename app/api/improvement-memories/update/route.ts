import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { improvementMemories } from '@/app/db/schema';
import { withAuth } from '@/lib/api-helpers';
import { ADMIN_USER_ID } from '@/lib/constants';
import { eq, and } from 'drizzle-orm';
import { UpdateImprovementMemoryRequest, UpdateImprovementMemoryResponse, ErrorResponse } from '../types';

export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = UpdateImprovementMemoryRequest.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ErrorResponse>(
        { error: `Invalid request: ${validation.error.message}` },
        { status: 400 }
      );
    }

    const { id, newDescription } = validation.data;

    // Update the memory (ensure it belongs to admin user for security)
    const [updated] = await db
      .update(improvementMemories)
      .set({
        userDescription: newDescription,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(improvementMemories.id, id),
          eq(improvementMemories.userId, ADMIN_USER_ID)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Memory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<UpdateImprovementMemoryResponse>({
      success: true,
      memory: updated,
    });
  } catch (error) {
    console.error('Error updating improvement memory:', error);
    return NextResponse.json<ErrorResponse>(
      { error: 'Failed to update improvement memory' },
      { status: 500 }
    );
  }
});
