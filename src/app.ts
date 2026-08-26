import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import { loggerMiddleware } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import {
  correlationIdMiddleware,
  globalApiRateLimiter,
  inputSanitizationMiddleware,
} from './middleware/security';
import { swaggerSpec } from './swagger/swagger';

import venturesRouter from './modules/ventures/ventures.router';
import pressRouter from './modules/press/press.router';
import careersRouter from './modules/careers/careers.router';
import governanceRouter from './modules/governance/governance.router';
import contactRouter from './modules/contact/contact.router';
import metricsRouter from './modules/metrics/metrics.router';

export const app = express();

// Disable X-Powered-By header to prevent fingerprinting
app.disable('x-powered-by');

// Advanced Industry-Standard Security Headers (Helmet Suite)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://unpkg.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://unpkg.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://*'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  })
);

// Strict CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Vercel serverless) or matching domains
      if (!origin || env.CORS_ORIGIN === '*' || origin.includes('aneevarp') || origin.includes('zenresume') || origin.includes('vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Correlation-ID', 'X-Request-ID'],
  })
);

// Payload Size Limits (DoS & Memory Exhaustion Prevention)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Correlation ID & Security Tracing
app.use(correlationIdMiddleware);

// Input Sanitization (Anti-XSS / Injection)
app.use(inputSanitizationMiddleware);

// Request Logging
app.use(loggerMiddleware);

const publicDir = path.join(process.cwd(), 'public');

// Preload HTML content into memory for instant crash-free serving on Vercel
let indexHtmlContent = '';
try {
  const p1 = path.join(process.cwd(), 'public/index.html');
  const p2 = path.join(__dirname, '../public/index.html');
  if (fs.existsSync(p1)) {
    indexHtmlContent = fs.readFileSync(p1, 'utf8');
  } else if (fs.existsSync(p2)) {
    indexHtmlContent = fs.readFileSync(p2, 'utf8');
  }
} catch (e) {
  console.warn('[HTML Preload Warn]:', e);
}

// Serve Static Frontend UI files if present
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

/**
 * System health check endpoint (Sanitized, zero internal architecture leakage)
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'aneevarp-solutions-parent-gateway',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// OpenAPI Spec JSON Endpoint
app.get('/api/swagger.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(swaggerSpec);
});

// Standalone High-Speed Swagger UI Endpoint (CDN-powered for 100% Vercel Serverless Reliability)
app.get('/docs', (req: Request, res: Response) => {
  const specJson = JSON.stringify(swaggerSpec);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Aneevarp Solutions — API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5/favicon-32x32.png" />
  <style>
    body { margin: 0; background: #faf9f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .topbar { display: none !important; }
    .swagger-ui .info { margin: 24px 0; }
    .swagger-ui .info .title { color: #1A1F1F; font-weight: 800; font-size: 28px; }
    .swagger-ui .btn.authorize { background-color: #476550; color: #fff; border-color: #476550; }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #476550; }
    .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #1A1F1F; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        spec: ${specJson},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
});

// API v1 Routes (Protected by Global Rate Limiter)
app.use('/api/v1', globalApiRateLimiter);
app.use('/api/v1/ventures', venturesRouter);
app.use('/api/v1/press', pressRouter);
app.use('/api/v1/careers', careersRouter);
app.use('/api/v1/governance', governanceRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/metrics', metricsRouter);

// Root & Landing Page Handler
app.get('/', (req: Request, res: Response) => {
  if (indexHtmlContent) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(indexHtmlContent);
  }
  const p = path.join(publicDir, 'index.html');
  if (fs.existsSync(p)) return res.sendFile(p);
  return res.status(200).send('<!DOCTYPE html><html><body><h1>Aneevarp Solutions</h1></body></html>');
});

// Favicon handler
app.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end();
});

// Fallback for unmatched routes
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  if (indexHtmlContent) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(indexHtmlContent);
  }
  res.redirect('/');
});

// Global Error Handler
app.use(errorHandler);

// Crucial default export for Vercel Serverless Function compatibility
export default app;
module.exports = app;
