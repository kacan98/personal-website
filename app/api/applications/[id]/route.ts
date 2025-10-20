import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { jobApplications, APPLICATION_STATUSES } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { withAuth, parseApplicationId, invalidIdResponse, notFoundResponse } from '@/lib/api-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const GET = withAuth(async (
  request: NextRequest,
  { params }: RouteParams
) => {
  try {
    const { id } = await params;
    const applicationId = parseApplicationId(id);

    if (applicationId === null) {
      return invalidIdResponse();
    }

    // Fetch application from database
    const [application] = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, applicationId));

    if (!application) {
      return notFoundResponse();
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error fetching job application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job application' },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (
  request: NextRequest,
  { params }: RouteParams
) => {
  try {
    const { id } = await params;
    const applicationId = parseApplicationId(id);

    if (applicationId === null) {
      return invalidIdResponse();
    }

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

    // Validate status if provided
    const validStatuses = Object.values(APPLICATION_STATUSES);
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Update application in database
    const [updatedApplication] = await db
      .update(jobApplications)
      .set({
        jobUrl,
        positionTitle,
        companyName,
        positionDetails,
        positionSummary,
        cvData,
        motivationalLetter,
        appliedAt: appliedAt ? new Date(appliedAt) : undefined,
        status: status || APPLICATION_STATUSES.DRAFT,
        updatedAt: new Date(),
      })
      .where(eq(jobApplications.id, applicationId))
      .returning();

    if (!updatedApplication) {
      return notFoundResponse();
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error updating job application:', error);
    return NextResponse.json(
      { error: 'Failed to update job application' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: RouteParams
) => {
  try {
    const { id } = await params;
    const applicationId = parseApplicationId(id);

    if (applicationId === null) {
      return invalidIdResponse();
    }

    // Delete application from database
    const [deletedApplication] = await db
      .delete(jobApplications)
      .where(eq(jobApplications.id, applicationId))
      .returning();

    if (!deletedApplication) {
      return notFoundResponse();
    }

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job application:', error);
    return NextResponse.json(
      { error: 'Failed to delete job application' },
      { status: 500 }
    );
  }
});
