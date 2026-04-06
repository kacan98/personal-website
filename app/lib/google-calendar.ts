import { db } from '@/app/db';
import { googleCalendarTokens } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL + '/api/calendar/oauth/callback';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

export interface CalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  conferenceData?: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: 'hangoutsMeet';
      };
    };
  };
}

export interface FreeBusyQuery {
  timeMin: string;
  timeMax: string;
  timeZone: string;
  items: Array<{ id: string }>;
}

export interface FreeBusyResponse {
  calendars: {
    [calendarId: string]: {
      busy: Array<{
        start: string;
        end: string;
      }>;
    };
  };
}

export class GoogleCalendarClient {
  private accessToken: string;
  private refreshToken: string;
  private expiresAt: Date;

  constructor(accessToken: string, refreshToken: string, expiresAt: Date) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
  }

  static async initialize(): Promise<GoogleCalendarClient | null> {
    try {
      const tokens = await db
        .select()
        .from(googleCalendarTokens)
        .orderBy(googleCalendarTokens.createdAt)
        .limit(1);

      if (tokens.length === 0) {
        return null;
      }

      const token = tokens[0];
      const client = new GoogleCalendarClient(
        token.accessToken,
        token.refreshToken,
        token.expiresAt
      );

      // Check if token is expired and refresh if needed
      if (new Date() >= token.expiresAt) {
        await client.refreshAccessToken();
      }

      return client;
    } catch (error) {
      // Table doesn't exist or DB error - calendar not set up
      return null;
    }
  }

  static getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  static async exchangeCodeForTokens(code: string): Promise<void> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    await db.insert(googleCalendarTokens).values({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      scope: data.scope,
    });
  }

  private async refreshAccessToken(): Promise<void> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: this.refreshToken,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    this.accessToken = data.access_token;
    this.expiresAt = expiresAt;

    // Update in database
    await db
      .update(googleCalendarTokens)
      .set({
        accessToken: data.access_token,
        expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(googleCalendarTokens.refreshToken, this.refreshToken));
  }

  private async ensureValidToken(): Promise<void> {
    if (new Date() >= this.expiresAt) {
      await this.refreshAccessToken();
    }
  }

  async createEvent(event: CalendarEvent): Promise<{ id: string; meetLink?: string }> {
    await this.ensureValidToken();

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/primary/events?conferenceDataVersion=1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    const data = await response.json();
    return {
      id: data.id,
      meetLink: data.hangoutLink,
    };
  }

  async updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<void> {
    await this.ensureValidToken();

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/primary/events/${eventId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update calendar event');
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.ensureValidToken();

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );

    if (!response.ok && response.status !== 404) {
      throw new Error('Failed to delete calendar event');
    }
  }

  async getFreeBusy(query: FreeBusyQuery): Promise<FreeBusyResponse> {
    await this.ensureValidToken();

    const response = await fetch(`${CALENDAR_API_BASE}/freeBusy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch free/busy information');
    }

    return response.json();
  }
}
