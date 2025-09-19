import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { JWT_SECRET, CV_ADMIN_PASSWORD } from './env';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const secret = new TextEncoder().encode(JWT_SECRET);

// Session duration configuration
const SESSION_DURATION_DAYS = 14;
const SESSION_DURATION_SECONDS = SESSION_DURATION_DAYS * 24 * 60 * 60;


export interface AuthResult {
  authenticated: boolean;
  error?: string;
}

/**
 * Create a JWT token for authentication using jose library
 */
export async function createAuthToken(): Promise<string> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(secret);

  return token;
}

/**
 * Verify JWT token using jose library
 */
export async function verifyAuthToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.log('Token verification failed:', error);
    return false;
  }
}

/**
 * Validate password for CV admin access
 */
export function validatePassword(password: string): boolean {
  if (!CV_ADMIN_PASSWORD) {
    console.error('CV_ADMIN_PASSWORD environment variable not set!');
    return false;
  }
  return password === CV_ADMIN_PASSWORD;
}

/**
 * Check authentication from request cookies
 */
export async function checkAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const authCookie = request.cookies.get('cv-auth-token');

    if (!authCookie?.value) {
      return { authenticated: false, error: 'No authentication token found' };
    }

    const isValid = await verifyAuthToken(authCookie.value);

    if (!isValid) {
      return { authenticated: false, error: 'Invalid or expired token' };
    }

    return { authenticated: true };
  } catch (error) {
    console.error('Auth check failed:', error);
    return { authenticated: false, error: 'Authentication error' };
  }
}

/**
 * Check authentication from standard Request object
 */
export async function checkAuthFromRequest(request: Request): Promise<AuthResult> {
  try {
    // Extract cookies from Request header
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return { authenticated: false, error: 'No cookies found' };
    }

    // Parse cookies manually
    const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        acc[name] = decodeURIComponent(value);
      }
      return acc;
    }, {});

    const authToken = cookies['cv-auth-token'];
    if (!authToken) {
      return { authenticated: false, error: 'No authentication token found' };
    }

    const isValid = await verifyAuthToken(authToken);

    if (!isValid) {
      return { authenticated: false, error: 'Invalid or expired token' };
    }

    return { authenticated: true };
  } catch (error) {
    console.error('Auth check failed:', error);
    return { authenticated: false, error: 'Authentication error' };
  }
}

/**
 * Cookie configuration for auth token
 */
export const AUTH_COOKIE_CONFIG = {
  name: 'cv-auth-token',
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: SESSION_DURATION_SECONDS,
    path: '/'
  }
};

/**
 * Rate limiting for authentication attempts
 */
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts?: number } {
  const now = Date.now();
  const hour = 60 * 60 * 1000; // 1 hour in ms

  const attempts = authAttempts.get(ip);

  if (!attempts) {
    authAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: 4 };
  }

  // Reset if more than an hour has passed
  if (now - attempts.lastAttempt > hour) {
    authAttempts.set(ip, { count: 1, lastAttempt: now });
    return { allowed: true, remainingAttempts: 4 };
  }

  // Check if too many attempts
  if (attempts.count >= 5) {
    return { allowed: false };
  }

  // Increment attempt count
  attempts.count++;
  attempts.lastAttempt = now;

  return { allowed: true, remainingAttempts: 5 - attempts.count };
}