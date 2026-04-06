import { NextResponse } from 'next/server';
import { MEETING_TYPES } from '@/app/lib/schedule-config';

export async function GET() {
  // Return meeting types from config file
  return NextResponse.json(MEETING_TYPES);
}
