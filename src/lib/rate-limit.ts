import { NextRequest, NextResponse } from "next/server";

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitInfo>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, info] of rateLimitStore.entries()) {
    if (now > info.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: NextRequest) => string;
}

export function rateLimit(config: RateLimitConfig = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute
    maxRequests = 10,
    skipSuccessfulRequests = false,
    keyGenerator = (req: NextRequest) => 
      req.headers.get("x-forwarded-for") || 
      req.headers.get("x-real-ip") || 
      "unknown"
  } = config;

  return function rateLimitMiddleware(
    handler: (req: NextRequest, ...args: unknown[]) => Promise<NextResponse>
  ) {
    return async (req: NextRequest, ...args: unknown[]): Promise<NextResponse> => {
      const key = keyGenerator(req);
      const now = Date.now();

      let rateLimitInfo = rateLimitStore.get(key);

      // Initialize or reset if window has passed
      if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
        rateLimitInfo = {
          count: 0,
          resetTime: now + windowMs,
        };
      }

      // Check if limit exceeded
      if (rateLimitInfo.count >= maxRequests) {
        return NextResponse.json(
          { 
            error: "Too many requests", 
            retryAfter: Math.ceil((rateLimitInfo.resetTime - now) / 1000) 
          },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Limit": maxRequests.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": rateLimitInfo.resetTime.toString(),
              "Retry-After": Math.ceil((rateLimitInfo.resetTime - now) / 1000).toString(),
            }
          }
        );
      }

      // Execute the handler
      const response = await handler(req, ...args);

      // Only increment count if request was not successful and skipSuccessfulRequests is true
      if (!skipSuccessfulRequests || response.status >= 400) {
        rateLimitInfo.count++;
        rateLimitStore.set(key, rateLimitInfo);
      }

      // Add rate limit headers
      response.headers.set("X-RateLimit-Limit", maxRequests.toString());
      response.headers.set("X-RateLimit-Remaining", (maxRequests - rateLimitInfo.count).toString());
      response.headers.set("X-RateLimit-Reset", rateLimitInfo.resetTime.toString());

      return response;
    };
  };
}