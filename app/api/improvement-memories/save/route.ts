import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { improvementMemories } from '@/app/db/schema';
import { withAuth } from '@/lib/api-helpers';
import { ADMIN_USER_ID } from '@/lib/constants';
import { eq, and } from 'drizzle-orm';
import { SaveImprovementMemoriesRequest, SaveImprovementMemoriesResponse, ErrorResponse } from '../types';

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate input with Zod
    const validation = SaveImprovementMemoriesRequest.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ErrorResponse>(
        { error: `Invalid request: ${validation.error.message}` },
        { status: 400 }
      );
    }

    const { improvements } = validation.data;

    const savedMemories = [];
    const now = new Date();

    // Process each improvement
    for (const { key, description } of improvements) {
      // Check if this improvement key already exists for this user
      const existing = await db
        .select()
        .from(improvementMemories)
        .where(
          and(
            eq(improvementMemories.userId, ADMIN_USER_ID),
            eq(improvementMemories.improvementKey, key)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update existing memory - increment usage count and update timestamps
        const [updated] = await db
          .update(improvementMemories)
          .set({
            userDescription: description, // Update with latest description
            usageCount: existing[0].usageCount + 1,
            lastUsed: now,
            updatedAt: now,
          })
          .where(eq(improvementMemories.id, existing[0].id))
          .returning();

        savedMemories.push(updated);
      } else {
        // Create new memory
        const [newMemory] = await db
          .insert(improvementMemories)
          .values({
            userId: ADMIN_USER_ID,
            improvementKey: key,
            userDescription: description,
            confidence: 1,
            usageCount: 1,
            lastUsed: now,
          })
          .returning();

        savedMemories.push(newMemory);
      }
    }

    return NextResponse.json<SaveImprovementMemoriesResponse>({
      success: true,
      memories: savedMemories,
    });
  } catch (error) {
    console.error('Error saving improvement memories:', error);
    return NextResponse.json<ErrorResponse>(
      { error: 'Failed to save improvement memories' },
      { status: 500 }
    );
  }
});
