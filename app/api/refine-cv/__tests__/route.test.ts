import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'

// Mock the authentication middleware
vi.mock('@/lib/auth-middleware', () => ({
  checkAuthFromRequest: vi.fn(),
}))

// Mock OpenAI
vi.mock('openai', () => ({
  OpenAI: vi.fn(() => ({
    chat: {
      completions: {
        parse: vi.fn(),
      },
    },
  })),
}))

// Mock environment variables
vi.mock('@/lib/env', () => ({
  OPENAI_API_KEY: 'test-api-key',
}))

describe('POST /api/refine-cv', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should reject unauthenticated requests with 401', async () => {
    // Import the mock after vi.mock is set up
    const { checkAuthFromRequest } = await import('@/lib/auth-middleware')

    // Mock authentication to fail
    vi.mocked(checkAuthFromRequest).mockResolvedValueOnce({
      authenticated: false,
    })

    // Create a mock request
    const mockRequest = new Request('http://localhost/api/refine-cv', {
      method: 'POST',
      body: JSON.stringify({
        originalCv: {},
        currentCv: {},
        checkedImprovements: ['test improvement'],
      }),
    })

    // Call the route handler
    const response = await POST(mockRequest)

    // Verify the response
    expect(response.status).toBe(401)

    const data = await response.json()
    expect(data).toEqual({
      error: 'Authentication required',
    })
  })

  it('should allow authenticated requests to proceed', async () => {
    // Import the mock after vi.mock is set up
    const { checkAuthFromRequest } = await import('@/lib/auth-middleware')

    // Mock authentication to succeed
    vi.mocked(checkAuthFromRequest).mockResolvedValueOnce({
      authenticated: true,
    })

    // Create a mock request with invalid body to trigger validation error
    // (we want to verify auth passes, not test the full flow)
    const mockRequest = new Request('http://localhost/api/refine-cv', {
      method: 'POST',
      body: JSON.stringify({}), // Empty body will fail validation
    })

    // Call the route handler
    const response = await POST(mockRequest)

    // Should NOT be 401 (auth passed, but will fail validation)
    expect(response.status).not.toBe(401)

    // Verify checkAuthFromRequest was called
    expect(checkAuthFromRequest).toHaveBeenCalledWith(mockRequest)
  })
})
