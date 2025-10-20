import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { jobApplications, APPLICATION_STATUSES } from '@/app/db/schema';
import { withAuth } from '@/lib/api-helpers';

export const POST = withAuth(async (request: NextRequest) => {
  try {

    // Parse request body
    const body = await request.json();
    const {
      jobUrl,
      positionTitle,
      companyName,
      positionDetails,
      positionSummary,
      cvData,
      motivationalLetter,
      appliedAt,
      status,
    } = body;

    // Validate required fields
    if (!jobUrl || !positionTitle) {
      return NextResponse.json(
        { error: 'jobUrl and positionTitle are required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = Object.values(APPLICATION_STATUSES);
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Insert into database
    const [newApplication] = await db
      .insert(jobApplications)
      .values({
        jobUrl,
        positionTitle,
        companyName,
        positionDetails,
        positionSummary,
        cvData,
        motivationalLetter,
        appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
        status: status || APPLICATION_STATUSES.DRAFT,
      })
      .returning();

    return NextResponse.json({
      success: true,
      application: newApplication,
    });
  } catch (error) {
    console.error('Error saving job application:', error);
    return NextResponse.json(
      { error: 'Failed to save job application' },
      { status: 500 }
    );
  }
});
