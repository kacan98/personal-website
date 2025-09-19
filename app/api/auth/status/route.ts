import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth-middleware';

export interface AuthStatusResponse {
  authenticated: boolean;
  message?: string;
}

export const runtime = 'nodejs';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await checkAuth(request);

    const response: AuthStatusResponse = {
      authenticated: authResult.authenticated,
      message: authResult.error || (authResult.authenticated ? 'Authenticated' : 'Not authenticated')
    };

    return NextResponse.json(response, {
      status: 200 // Always return 200 - the authenticated field indicates auth status
    });

  } catch (error) {
    console.error('Auth status endpoint error:', error);
    return NextResponse.json(
      {
        authenticated: false,
        message: 'Internal server error'
      } as AuthStatusResponse,
      { status: 500 }
    );
  }
}