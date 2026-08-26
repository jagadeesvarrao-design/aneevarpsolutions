import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const correlationId = (req as any).correlationId || 'N/A';
  const isProduction = process.env.NODE_ENV === 'production';

  // Redact potentially sensitive parameters from internal logs
  const sanitizedUrl = req.originalUrl.replace(/([?&](token|key|password|secret)=)[^&]+/gi, '$1[REDACTED]');
  
  // Safe user-facing error message
  let publicMessage = err.message || 'Internal Server Error';
  if (statusCode === 500 && isProduction) {
    publicMessage = 'An unexpected server error occurred. Please quote the correlation ID when contacting support.';
  }

  // Server-side diagnostic log
  console.error(`[ERROR][${correlationId}] ${req.method} ${sanitizedUrl} -> ${statusCode}: ${err.message}`);
  if (err.stack && !isProduction) {
    console.error(err.stack);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      message: publicMessage,
      statusCode,
      correlationId,
      ...(err.details && !isProduction ? { details: err.details } : {}),
    },
  });
}
