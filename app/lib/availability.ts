import { db } from '@/app/db';
import { bookings } from '@/app/db/schema';
import { and, gte, lte, eq } from 'drizzle-orm';
import { GoogleCalendarClient } from './google-calendar';
import { MEETING_TYPES, WEEKLY_AVAILABILITY, BUFFER_MINUTES } from './schedule-config';

export interface TimeSlot {
  start: Date;
  end: Date;
}

export class AvailabilityService {
  static async getAvailableSlots(
    startDate: Date,
    endDate: Date,
    meetingTypeId: string
  ): Promise<TimeSlot[]> {
    // Get meeting type from config
    const meetingType = MEETING_TYPES.find(t => t.id === meetingTypeId);

    if (!meetingType) {
      throw new Error('Meeting type not found');
    }

    const duration = meetingType.duration;

    // Get weekly schedule from config
    const schedules = WEEKLY_AVAILABILITY;

    // Get existing bookings in the date range
    let existingBookings: Array<{ scheduledAt: Date; scheduledEndAt: Date }> = [];
    console.log('[AVAILABILITY] Checking existing bookings...');
    try {
      existingBookings = await db
        .select()
        .from(bookings)
        .where(
          and(
            gte(bookings.scheduledAt, startDate),
            lte(bookings.scheduledAt, endDate),
            eq(bookings.status, 'scheduled')
          )
        );
      console.log(`[AVAILABILITY] Found ${existingBookings.length} existing bookings`);
    } catch (error) {
      console.log('[AVAILABILITY] DB query failed (table may not exist) - skipping');
      // Continue without existing bookings check
    }

    // Get busy times from Google Calendar (with timeout)
    let googleBusySlots: TimeSlot[] = [];
    try {
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Calendar timeout')), 1500)
      );

      const calendarPromise = GoogleCalendarClient.initialize().then(async (calendarClient) => {
        if (calendarClient) {
          const freeBusyResponse = await calendarClient.getFreeBusy({
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            timeZone: 'UTC',
            items: [{ id: 'primary' }],
          });

          return freeBusyResponse.calendars.primary?.busy.map((slot) => ({
            start: new Date(slot.start),
            end: new Date(slot.end),
          })) || [];
        }
        return [];
      });

      googleBusySlots = await Promise.race([calendarPromise, timeoutPromise]) || [];
    } catch (error) {
      console.log('Google Calendar check skipped (not connected or timeout)');
      // Continue without Google Calendar - it's optional
    }

    const busySlots: TimeSlot[] = [
      ...existingBookings.map((b) => ({
        start: b.scheduledAt,
        end: b.scheduledEndAt,
      })),
      ...googleBusySlots,
    ];

    // Generate available slots based on weekly schedule
    const availableSlots: TimeSlot[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      // Find schedules for this day of week
      const daySchedules = schedules.filter((s) => s.dayOfWeek === dayOfWeek);

      for (const schedule of daySchedules) {
        const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
        const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

        const slotStart = new Date(currentDate);
        slotStart.setHours(startHour, startMinute, 0, 0);

        const dayEnd = new Date(currentDate);
        dayEnd.setHours(endHour, endMinute, 0, 0);

        // Generate slots for this time block
        while (slotStart < dayEnd) {
          const slotEnd = new Date(slotStart.getTime() + duration * 60000);

          if (slotEnd <= dayEnd) {
            const slot: TimeSlot = {
              start: new Date(slotStart),
              end: new Date(slotEnd),
            };

            // Check if slot conflicts with existing bookings or Google Calendar
            const hasConflict = this.hasConflict(slot, busySlots);

            if (!hasConflict && slot.start > new Date()) {
              availableSlots.push(slot);
            }
          }

          // Move to next slot (increment by duration only, buffer is for conflict checking)
          slotStart.setMinutes(slotStart.getMinutes() + duration);
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
    }

    return availableSlots;
  }

  private static hasConflict(slot: TimeSlot, busySlots: TimeSlot[]): boolean {
    // Add buffer time to the slot
    const bufferStart = new Date(slot.start.getTime() - BUFFER_MINUTES * 60000);
    const bufferEnd = new Date(slot.end.getTime() + BUFFER_MINUTES * 60000);

    return busySlots.some((busy) => {
      return bufferStart < busy.end && bufferEnd > busy.start;
    });
  }

  static async isSlotAvailable(
    startTime: Date,
    endTime: Date,
    meetingTypeId: string
  ): Promise<boolean> {
    const slots = await this.getAvailableSlots(
      new Date(startTime.getTime() - 86400000), // Check day before
      new Date(endTime.getTime() + 86400000), // Check day after
      meetingTypeId
    );

    return slots.some(
      (slot) =>
        slot.start.getTime() === startTime.getTime() &&
        slot.end.getTime() === endTime.getTime()
    );
  }
}
