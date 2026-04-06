import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { bookings } from '@/app/db/schema';
import { GoogleCalendarClient } from '@/app/lib/google-calendar';
import { AvailabilityService } from '@/app/lib/availability';
import { EmailService } from '@/app/lib/email';
import { MEETING_TYPES } from '@/app/lib/schedule-config';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      meetingTypeId,
      attendeeName,
      attendeeEmail,
      attendeePhone,
      attendeeCompany,
      meetingTopic,
      scheduledAt,
      timezone,
    } = body;

    // Validate required fields
    if (!meetingTypeId || !attendeeName || !attendeeEmail || !scheduledAt || !timezone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get meeting type from config
    const meetingType = MEETING_TYPES.find(t => t.id === meetingTypeId);

    if (!meetingType) {
      return NextResponse.json(
        { error: 'Meeting type not found' },
        { status: 404 }
      );
    }

    const duration = meetingType.duration;
    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Check if slot is still available
    const isAvailable = await AvailabilityService.isSlotAvailable(
      startTime,
      endTime,
      meetingTypeId
    );

    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Selected time slot is no longer available' },
        { status: 409 }
      );
    }

    // Generate cancellation token
    const cancellationToken = crypto.randomBytes(32).toString('hex');

    // Create Google Calendar event
    let googleCalendarEventId: string | undefined;
    let googleMeetLink: string | undefined;

    try {
      const calendarClient = await GoogleCalendarClient.initialize();
      if (calendarClient) {
        const event = await calendarClient.createEvent({
          summary: `${meetingType.duration}min meeting with ${attendeeName}`,
          description: meetingTopic
            ? `Topic: ${meetingTopic}\n\nCompany: ${attendeeCompany || 'N/A'}\n\nScheduled via personal website`
            : `Meeting with ${attendeeName} from ${attendeeCompany || 'N/A'}`,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: timezone,
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: timezone,
          },
          attendees: [
            {
              email: attendeeEmail,
              displayName: attendeeName,
            },
          ],
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID(),
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
            },
          },
        });

        googleCalendarEventId = event.id;
        googleMeetLink = event.meetLink;
      }
    } catch (error) {
      console.error('Failed to create Google Calendar event:', error);
    }

    // Create booking in database
    const newBooking = await db
      .insert(bookings)
      .values({
        meetingTypeId,
        attendeeName,
        attendeeEmail,
        attendeePhone,
        attendeeCompany,
        meetingTopic,
        scheduledAt: startTime,
        scheduledEndAt: endTime,
        timezone,
        googleCalendarEventId,
        googleMeetLink,
        cancellationToken,
        status: 'scheduled',
      })
      .returning();

    // Send confirmation email
    try {
      await EmailService.sendBookingConfirmation({
        attendeeName,
        attendeeEmail,
        meetingDuration: meetingType.duration,
        scheduledAt: startTime,
        scheduledEndAt: endTime,
        timezone,
        meetLink: googleMeetLink,
        cancellationToken,
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }

    return NextResponse.json({
      booking: newBooking[0],
      meetLink: googleMeetLink,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allBookings = await db
      .select()
      .from(bookings)
      .orderBy(bookings.scheduledAt);

    return NextResponse.json(allBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
