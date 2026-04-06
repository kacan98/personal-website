import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityService } from '@/app/lib/availability';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const meetingTypeId = searchParams.get('meetingTypeId');

    console.log('[SLOTS] Request received:', { startDate, endDate, meetingTypeId });

    if (!startDate || !endDate || !meetingTypeId) {
      return NextResponse.json(
        { error: 'startDate, endDate, and meetingTypeId are required' },
        { status: 400 }
      );
    }

    console.log('[SLOTS] Calling AvailabilityService...');
    const slots = await AvailabilityService.getAvailableSlots(
      new Date(startDate),
      new Date(endDate),
      meetingTypeId
    );

    const elapsed = Date.now() - startTime;
    console.log(`[SLOTS] Success! Found ${slots.length} slots in ${elapsed}ms`);

    return NextResponse.json(slots);
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[SLOTS] Error after ${elapsed}ms:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    );
  }
}
