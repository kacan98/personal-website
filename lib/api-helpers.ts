import { NextRequest, NextResponse } from 'next/server';
import { checkAuthFromRequest } from '@/lib/auth-middleware';

/**
 * Higher-order function to wrap API routes with authentication
 * Reduces repetitive auth checking code
 *
 * @example
 * export const GET = withAuth(async (request: NextRequest) => {
 *   // Your authenticated logic here
 * });
 */
export function withAuth<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResult = await checkAuthFromRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return handler(request, ...args);
  };
}

/**
 * Parse and validate an application ID from a route parameter
 * Returns null if the ID is invalid (NaN)
 *
 * @param id - The ID string from route params
 * @returns Parsed integer ID or null if invalid
 */
export function parseApplicationId(id: string): number | null {
  const applicationId = parseInt(id, 10);
  return isNaN(applicationId) ? null : applicationId;
}

/**
 * Create a standardized error response for invalid IDs
 */
export function invalidIdResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Invalid application ID' },
    { status: 400 }
  );
}

/**
 * Create a standardized error response for not found resources
 */
export function notFoundResponse(resource = 'Application'): NextResponse {
  return NextResponse.json(
    { error: `${resource} not found` },
    { status: 404 }
  );
}
