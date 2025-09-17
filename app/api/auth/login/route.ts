import { NextRequest, NextResponse } from 'next/server';
import {
  validatePassword,
  createAuthToken,
  checkRateLimit,
  AUTH_COOKIE_CONFIG
} from '@/lib/auth-middleware';

export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  remainingAttempts?: number;
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               request.headers.get('cf-connecting-ip') || // Cloudflare
               'unknown';

    // Check rate limiting
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      console.log(`Auth attempt blocked for IP ${ip} - rate limit exceeded`);
      return NextResponse.json(
        {
          success: false,
          message: 'Too many authentication attempts. Please try again later.'
        } as LoginResponse,
        { status: 429 }
      );
    }

    // Parse request body
    let body: LoginRequest;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format'
        } as LoginResponse,
        { status: 400 }
      );
    }

    // Validate password
    if (!body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password is required',
          remainingAttempts: rateLimit.remainingAttempts
        } as LoginResponse,
        { status: 400 }
      );
    }

    // Check password
    const isValidPassword = validatePassword(body.password);

    if (!isValidPassword) {
      console.log(`Failed auth attempt for IP ${ip}`);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid password',
          remainingAttempts: rateLimit.remainingAttempts
        } as LoginResponse,
        { status: 401 }
      );
    }

    // Create auth token
    const token = await createAuthToken();

    // Create response with auth cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Authentication successful'
      } as LoginResponse,
      { status: 200 }
    );

    // Set auth cookie
    response.cookies.set(
      AUTH_COOKIE_CONFIG.name,
      token,
      AUTH_COOKIE_CONFIG.options
    );

    console.log(`Successful auth for IP ${ip}`);
    return response;

  } catch (error) {
    console.error('Login endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      } as LoginResponse,
      { status: 500 }
    );
  }
}