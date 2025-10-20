import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { jobApplications } from '@/app/db/schema';
import { sql, gte, lte, and } from 'drizzle-orm';

/**
 * Public endpoint - No authentication required
 * This endpoint provides public statistics about job applications
 * for portfolio/transparency purposes
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where conditions
    const conditions = [];
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      conditions.push(gte(jobApplications.appliedAt, start));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      conditions.push(lte(jobApplications.appliedAt, end));
    }

    // Query applications grouped by date AND status
    const stats = await db
      .select({
        date: sql<string>`DATE(${jobApplications.appliedAt})`.as('date'),
        status: jobApplications.status,
        count: sql<number>`COUNT(*)::int`.as('count'),
      })
      .from(jobApplications)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(sql`DATE(${jobApplications.appliedAt})`, jobApplications.status)
      .orderBy(sql`DATE(${jobApplications.appliedAt})`);

    // Also get public info for each application (just URL, title, and status)
    const applications = await db
      .select({
        id: jobApplications.id,
        jobUrl: jobApplications.jobUrl,
        positionTitle: jobApplications.positionTitle,
        appliedAt: jobApplications.appliedAt,
        status: jobApplications.status,
      })
      .from(jobApplications)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(jobApplications.appliedAt);

    // Calculate total count (sum all status counts across all days)
    const totalCount = stats.reduce((sum, stat) => sum + stat.count, 0);

    return NextResponse.json({
      success: true,
      stats,
      applications,
      totalCount,
      dateRange: {
        start: startDate || null,
        end: endDate || null,
      },
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application stats' },
      { status: 500 }
    );
  }
}
