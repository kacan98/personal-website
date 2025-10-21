import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { jobApplications } from '@/app/db/schema';
import { desc } from 'drizzle-orm';
import { withAuth } from '@/lib/api-helpers';

export const GET = withAuth(async (_request: NextRequest) => {
  try {

    // Fetch last 10 applications
    const applications = await db
      .select({
        id: jobApplications.id,
        jobUrl: jobApplications.jobUrl,
        positionTitle: jobApplications.positionTitle,
        companyName: jobApplications.companyName,
        appliedAt: jobApplications.appliedAt,
        createdAt: jobApplications.createdAt,
      })
      .from(jobApplications)
      .orderBy(desc(jobApplications.createdAt))
      .limit(10);

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('Error fetching recent applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent applications' },
      { status: 500 }
    );
  }
});
