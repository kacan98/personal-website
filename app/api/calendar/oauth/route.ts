import { NextResponse } from 'next/server';
import { GoogleCalendarClient } from '@/app/lib/google-calendar';

export async function GET() {
  const authUrl = GoogleCalendarClient.getAuthUrl();
  return NextResponse.redirect(authUrl);
}
