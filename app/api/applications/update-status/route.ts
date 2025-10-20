import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { jobApplications } from '@/app/db/schema';
import { sql } from 'drizzle-orm';
import { checkAuthFromRequest } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await checkAuthFromRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update all records where status is null or empty to 'applied'
    const result = await db
      .update(jobApplications)
      .set({ status: 'applied' })
      .where(sql`${jobApplications.status} IS NULL OR ${jobApplications.status} = ''`)
      .returning();

    return NextResponse.json({
      success: true,
      updated: result.length,
      message: `Updated ${result.length} applications to "applied" status`,
    });
  } catch (error) {
    console.error('Error updating applications:', error);
    return NextResponse.json(
      { error: 'Failed to update applications' },
      { status: 500 }
    );
  }
}
