import { checkAuthFromRequest } from '@/lib/auth-middleware';

export interface AuthResult {
  authenticated: boolean;
  user?: any;
}

/**
 * Higher-order function that adds authentication to API routes
 * Eliminates the need to duplicate auth logic across all protected routes
 */
export function withAuth<_T = any>(
  handler: (req: Request, auth: AuthResult) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    try {
      const auth = await checkAuthFromRequest(req);

      if (!auth.authenticated) {
        return Response.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      return handler(req, auth);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return Response.json(
        { error: 'Internal authentication error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Utility for creating standardized API responses
 */
export class ApiResponse {
  static success<T>(data: T, options?: { cache?: boolean }) {
    return Response.json({
      data,
      ...(options?.cache !== undefined && {
        _cacheInfo: { fromCache: options.cache }
      })
    });
  }

  static error(message: string, status = 500) {
    return Response.json({ error: message }, { status });
  }

  static validationError(errors: Record<string, string>) {
    return Response.json(
      { error: 'Validation failed', errors },
      { status: 400 }
    );
  }
}