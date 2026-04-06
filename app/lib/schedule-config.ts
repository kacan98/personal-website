// Scheduling system configuration
// Edit these values to customize your availability and meeting types

export interface MeetingType {
  id: string;
  duration: number; // minutes
  color: string;
}

export interface WeeklyAvailability {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

// Your meeting options - just durations and colors
export const MEETING_TYPES: MeetingType[] = [
  { id: '15min', duration: 15, color: '#4CAF50' },
  { id: '30min', duration: 30, color: '#2196F3' },
  { id: '60min', duration: 60, color: '#9C27B0' },
];

// Your weekly availability (when people can book)
export const WEEKLY_AVAILABILITY: WeeklyAvailability[] = [
  // Monday - Friday, 9am - 5pm
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }, // Friday
];

// Buffer time between meetings (minutes)
export const BUFFER_MINUTES = 15;

// How many days in advance can people book?
export const BOOKING_WINDOW_DAYS = 60;
