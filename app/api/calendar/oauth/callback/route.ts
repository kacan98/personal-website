import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarClient } from '@/app/lib/google-calendar';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL('/schedule/admin?error=oauth_denied', request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/schedule/admin?error=missing_code', request.url)
    );
  }

  try {
    await GoogleCalendarClient.exchangeCodeForTokens(code);
    return NextResponse.redirect(
      new URL('/schedule/admin?success=calendar_connected', request.url)
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/schedule/admin?error=token_exchange_failed', request.url)
    );
  }
}
