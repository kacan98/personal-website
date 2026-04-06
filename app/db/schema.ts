import { pgSchema, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

// Create a dedicated schema namespace for the personal website
export const personalWebsiteSchema = pgSchema('personal_website');

// Application status enum - single source of truth
export const APPLICATION_STATUSES = {
  DRAFT: 'draft',
  APPLIED: 'applied',
  REJECTED: 'rejected',
  FOLLOW_UP_SENT: 'follow_up_sent',
  INTERVIEW: 'interview',
} as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[keyof typeof APPLICATION_STATUSES];

// Status display configuration
export const STATUS_CONFIG: Record<ApplicationStatus, { bg: string; text: string; label: string }> = {
  [APPLICATION_STATUSES.DRAFT]: { bg: '#757575', text: '#fff', label: 'Draft' },
  [APPLICATION_STATUSES.APPLIED]: { bg: '#1976d2', text: '#fff', label: 'Applied' },
  [APPLICATION_STATUSES.REJECTED]: { bg: '#d32f2f', text: '#fff', label: 'Rejected' },
  [APPLICATION_STATUSES.FOLLOW_UP_SENT]: { bg: '#f57c00', text: '#fff', label: 'Follow Up Sent' },
  [APPLICATION_STATUSES.INTERVIEW]: { bg: '#388e3c', text: '#fff', label: 'Interview' },
};

// Job applications table
export const jobApplications = personalWebsiteSchema.table('job_applications', {
  id: serial('id').primaryKey(),

  // Public fields (visible to everyone)
  jobUrl: text('job_url').notNull(),
  positionTitle: text('position_title').notNull(),
  status: text('status').notNull().default(APPLICATION_STATUSES.DRAFT).$type<ApplicationStatus>(),

  // Private fields (only visible when authenticated)
  companyName: text('company_name'),
  positionDetails: text('position_details'), // Full job description
  positionSummary: text('position_summary'), // AI-generated summary
  cvData: jsonb('cv_data'), // The CV JSON that was applied with
  motivationalLetter: text('motivational_letter'),

  // Timestamps
  appliedAt: timestamp('applied_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Type exports for TypeScript
export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;

// Improvement memories table - stores reusable CV improvement descriptions
export const improvementMemories = personalWebsiteSchema.table('improvement_memories', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  improvementKey: text('improvement_key').notNull(),
  userDescription: text('user_description').notNull(),
  confidence: integer('confidence').notNull().default(1),
  usageCount: integer('usage_count').notNull().default(1),
  lastUsed: timestamp('last_used').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type ImprovementMemory = typeof improvementMemories.$inferSelect;
export type NewImprovementMemory = typeof improvementMemories.$inferInsert;

// Bookings table - stores actual meeting bookings
// Note: Meeting types and availability are configured in app/lib/schedule-config.ts
export const bookings = personalWebsiteSchema.table('bookings', {
  id: serial('id').primaryKey(),
  meetingTypeId: text('meeting_type_id').notNull(), // References config, not a FK

  // Attendee information
  attendeeName: text('attendee_name').notNull(),
  attendeeEmail: text('attendee_email').notNull(),
  attendeePhone: text('attendee_phone'),
  attendeeCompany: text('attendee_company'),
  meetingTopic: text('meeting_topic'),

  // Meeting details
  scheduledAt: timestamp('scheduled_at').notNull(),
  scheduledEndAt: timestamp('scheduled_end_at').notNull(),
  timezone: text('timezone').notNull().default('UTC'),

  // Google Calendar integration
  googleCalendarEventId: text('google_calendar_event_id'),
  googleMeetLink: text('google_meet_link'),

  // Status tracking
  status: text('status').notNull().default('scheduled').$type<'scheduled' | 'cancelled' | 'completed'>(),
  cancellationReason: text('cancellation_reason'),
  cancelledAt: timestamp('cancelled_at'),

  // Unique cancellation token for public cancellation link
  cancellationToken: text('cancellation_token').notNull().unique(),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

// Google Calendar OAuth tokens
export const googleCalendarTokens = personalWebsiteSchema.table('google_calendar_tokens', {
  id: serial('id').primaryKey(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  scope: text('scope').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type GoogleCalendarToken = typeof googleCalendarTokens.$inferSelect;
export type NewGoogleCalendarToken = typeof googleCalendarTokens.$inferInsert;
