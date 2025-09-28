import { NextRequest, NextResponse } from 'next/server';
import { getCvSettings } from '@/data/cv-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const cvSettings = await getCvSettings(locale);
    return NextResponse.json(cvSettings);
  } catch (error) {
    console.error('Error fetching CV settings:', error);
    return NextResponse.json({ error: 'Failed to fetch CV settings' }, { status: 500 });
  }
}