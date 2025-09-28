/**
 * Custom error class for API operations
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  errors?: Record<string, string>;
  _cacheInfo?: {
    fromCache: boolean;
    cacheKey?: string;
  };
}

/**
 * Centralized API client to replace scattered fetch calls
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const responseData: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        responseData.error || 'An error occurred',
        response
      );
    }

    // Return the data directly, but preserve cache info
    return responseData.data as T;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Request with cache info extraction
   */
  async requestWithCacheInfo<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T; fromCache?: boolean }> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const responseData: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        responseData.error || 'An error occurred',
        response
      );
    }

    return {
      data: responseData.data as T,
      fromCache: responseData._cacheInfo?.fromCache,
    };
  }
}

// Create default instance
export const apiClient = new ApiClient();

/**
 * Hook for using API client in components
 */
export function useApiClient() {
  return apiClient;
}