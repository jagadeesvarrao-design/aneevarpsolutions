import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { env } from '../config/env';

/**
 * Attaches a unique Correlation / Request ID to every incoming request
 * for end-to-end security tracing without exposing internal state.
 */
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = (req.headers['x-correlation-id'] as string) || crypto.randomUUID();
  (req as any).correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  res.setHeader('X-Request-ID', correlationId);
  next();
}

/**
 * Standard Global API Rate Limiter
 * Restricts brute force and general scraping (120 requests per 15 minutes per IP)
 */
export const globalApiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP address. Please retry after 15 minutes.',
      statusCode: 429,
    },
  },
});

/**
 * Strict Form Submission Rate Limiter (Contact, Grievance, DSR, Venture Pitch)
 * Restricts spam submissions (15 attempts per 15 minutes per IP)
 */
export const submissionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Submission rate limit exceeded. Please wait a few minutes before submitting another inquiry.',
      statusCode: 429,
    },
  },
});

/**
 * Sensitive Endpoint Limiter (Telemetry Sync & Administrative Updates)
 */
export const sensitiveEndpointLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Rate limit exceeded on secure mutation endpoint.',
      statusCode: 429,
    },
  },
});

/**
 * Input sanitization helper to strip hazardous XSS tags and control characters
 */
function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/onerror\s*=/gi, '')
      .replace(/onload\s*=/gi, '')
      .replace(/\0/g, '')
      .trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    const sanitizedObj: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      sanitizedObj[key] = sanitizeValue(value[key]);
    }
    return sanitizedObj;
  }
  return value;
}

/**
 * Recursive Input Sanitizer Middleware (Mitigates XSS & Injection in JSON bodies)
 */
export function inputSanitizationMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  next();
}

/**
 * Timing-Safe API Key Authentication Middleware for Protected Mutations
 */
export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = (req.headers['x-api-key'] as string) || (req.headers.authorization?.replace(/^Bearer\s+/i, '') as string);

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized: Missing required API key in X-API-Key or Authorization header.',
        statusCode: 401,
      },
    });
  }

  const expectedKey = env.ADMIN_API_KEY;
  const apiKeyBuffer = Buffer.from(apiKey);
  const expectedKeyBuffer = Buffer.from(expectedKey);

  if (apiKeyBuffer.length !== expectedKeyBuffer.length || !crypto.timingSafeEqual(apiKeyBuffer, expectedKeyBuffer)) {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Forbidden: Invalid API key credentials provided.',
        statusCode: 403,
      },
    });
  }

  next();
}
