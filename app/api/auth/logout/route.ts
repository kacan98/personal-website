import { NextResponse } from 'next/server';
import { AUTH_COOKIE_CONFIG } from '@/lib/auth-middleware';

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export const runtime = 'nodejs';

export async function POST(): Promise<NextResponse> {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      } as LogoutResponse,
      { status: 200 }
    );

    // Clear auth cookie by setting it to expire immediately
    response.cookies.set(
      AUTH_COOKIE_CONFIG.name,
      '',
      {
        ...AUTH_COOKIE_CONFIG.options,
        maxAge: 0, // Expire immediately
        expires: new Date(0) // Set to past date
      }
    );

    console.log('User logged out - auth cookie cleared');
    return response;

  } catch (error) {
    console.error('Logout endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      } as LogoutResponse,
      { status: 500 }
    );
  }
}