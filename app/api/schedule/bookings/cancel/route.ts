import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import { bookings } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { GoogleCalendarClient } from '@/app/lib/google-calendar';
import { EmailService } from '@/app/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cancellationToken, reason } = body;

    if (!cancellationToken) {
      return NextResponse.json(
        { error: 'Cancellation token is required' },
        { status: 400 }
      );
    }

    // Find booking by cancellation token
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.cancellationToken, cancellationToken))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const bookingData = booking[0];

    if (bookingData.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      );
    }

    // Delete from Google Calendar
    if (bookingData.googleCalendarEventId) {
      try {
        const calendarClient = await GoogleCalendarClient.initialize();
        if (calendarClient) {
          await calendarClient.deleteEvent(bookingData.googleCalendarEventId);
        }
      } catch (error) {
        console.error('Failed to delete Google Calendar event:', error);
      }
    }

    // Update booking status
    await db
      .update(bookings)
      .set({
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingData.id));

    // Send cancellation email
    try {
      await EmailService.sendCancellationConfirmation(
        bookingData.attendeeEmail,
        bookingData.attendeeName,
        bookingData.scheduledAt
      );
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
