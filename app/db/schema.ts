import { pgSchema, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

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
