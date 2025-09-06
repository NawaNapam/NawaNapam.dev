import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ValidationSchemas, validateInput } from "./validationSchemas";

// Types for API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Generic API error class
export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public errors?: string[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Validation middleware for Next.js API routes
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return async (
    req: NextRequest,
    handler: (req: NextRequest, validatedData: T) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    try {
      let data: unknown;

      // Handle different HTTP methods
      if (req.method === "GET") {
        // For GET requests, validate query parameters
        const url = new URL(req.url);
        const queryParams: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
        data = queryParams;
      } else {
        // For POST/PUT/PATCH requests, validate body
        try {
          data = await req.json();
        } catch {
          return NextResponse.json(
            {
              success: false,
              error: "Invalid JSON in request body",
              timestamp: new Date().toISOString(),
            } as ApiResponse,
            { status: 400 }
          );
        }
      }

      // Validate the data
      const validation = validateInput(schema)(data);

      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            errors: validation.errors,
            timestamp: new Date().toISOString(),
          } as ApiResponse,
          { status: 400 }
        );
      }

      // Call the actual handler with validated data
      return await handler(req, validation.data);
    } catch (error) {
      console.error("Validation middleware error:", error);

      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            errors: error.errors,
            timestamp: new Date().toISOString(),
          } as ApiResponse,
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Internal server error",
          timestamp: new Date().toISOString(),
        } as ApiResponse,
        { status: 500 }
      );
    }
  };
}

// Success response helper
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>,
    { status: statusCode }
  );
}

// Error response helper
export function createErrorResponse(
  error: string,
  statusCode: number = 400,
  errors?: string[]
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      errors,
      timestamp: new Date().toISOString(),
    } as ApiResponse,
    { status: statusCode }
  );
}

// Paginated response helper
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse {
  const hasNext = page * limit < total;
  const hasPrev = page > 1;

  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        hasNext,
        hasPrev,
      },
      timestamp: new Date().toISOString(),
    } as PaginatedResponse<T>,
    { status: 200 }
  );
}

// Rate limiting helper
export class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();

  isAllowed(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [key, value] of this.requests.entries()) {
      if (value.resetTime < windowStart) {
        this.requests.delete(key);
      }
    }

    const current = this.requests.get(identifier);

    if (!current || current.resetTime < windowStart) {
      this.requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (current.count >= maxRequests) {
      return false;
    }

    current.count++;
    return true;
  }

  getRemainingRequests(identifier: string, maxRequests: number = 100): number {
    const current = this.requests.get(identifier);
    if (!current) return maxRequests;
    return Math.max(0, maxRequests - current.count);
  }
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter();

// IP address extraction helper
export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}

// Specific validation middlewares for common operations
export const ValidationMiddlewares = {
  // User operations
  createUser: createValidationMiddleware(ValidationSchemas.user.create),
  updateUser: createValidationMiddleware(ValidationSchemas.user.update),
  createAnonymousUser: createValidationMiddleware(
    ValidationSchemas.user.anonymous
  ),

  // Video session operations
  createVideoSession: createValidationMiddleware(
    ValidationSchemas.videoSession.create
  ),
  addMessage: createValidationMiddleware(
    ValidationSchemas.videoSession.addMessage
  ),
  updateSessionStatus: createValidationMiddleware(
    ValidationSchemas.videoSession.updateStatus
  ),

  // Matching queue operations
  joinQueue: createValidationMiddleware(ValidationSchemas.matchingQueue.create),

  // Report operations
  createReport: createValidationMiddleware(ValidationSchemas.report.create),

  // Subscription operations
  createSubscription: createValidationMiddleware(
    ValidationSchemas.subscription.create
  ),
  trackUsage: createValidationMiddleware(ValidationSchemas.subscription.usage),

  // Common query parameters
  pagination: createValidationMiddleware(
    z.object({
      page: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().int().min(1))
        .default(1),
      limit: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().int().min(1).max(100))
        .default(20),
      sort: z.string().optional(),
      order: z.enum(["asc", "desc"]).default("desc"),
    })
  ),

  // Search parameters
  search: createValidationMiddleware(
    z.object({
      q: z.string().min(1).max(100).trim(),
      type: z.enum(["user", "session", "report"]).optional(),
      status: z.string().optional(),
    })
  ),
};

// Request logging middleware
export function logRequest(req: NextRequest): void {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers.get("user-agent") || "unknown";
  const ip = getClientIP(req);

  console.log(`[${timestamp}] ${method} ${url} - ${ip} - ${userAgent}`);
}

// CORS helper
export function setCORSHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

// Security headers helper
export function setSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}
