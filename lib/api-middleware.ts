import { checkAuthFromRequest, AuthResult } from './auth-middleware';

export interface StandardErrorResponse {
  error: string;
}

/**
 * Middleware wrapper for API routes that require authentication
 */
export function withAuth<T extends any[]>(
  handler: (req: Request, ...args: T) => Promise<Response>
) {
  return async (req: Request, ...args: T): Promise<Response> => {
    // Always check authentication
    const authResult: AuthResult = await checkAuthFromRequest(req);

    if (!authResult.authenticated) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' } as StandardErrorResponse),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return handler(req, ...args);
  };
}

/**
 * Standard error response helper
 */
export function createErrorResponse(error: string, status: number = 500): Response {
  return new Response(
    JSON.stringify({ error } as StandardErrorResponse),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Standard success response helper
 */
export function createSuccessResponse<T>(data: T, status: number = 200): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}