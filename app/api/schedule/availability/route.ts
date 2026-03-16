import { NextResponse } from 'next/server';
import { WEEKLY_AVAILABILITY } from '@/app/lib/schedule-config';

export async function GET() {
  // Return availability from config file
  return NextResponse.json(WEEKLY_AVAILABILITY);
}
