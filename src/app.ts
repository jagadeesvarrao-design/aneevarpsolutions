import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { loggerMiddleware } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './swagger/swagger';

import venturesRouter from './modules/ventures/ventures.router';
import pressRouter from './modules/press/press.router';
import careersRouter from './modules/careers/careers.router';
import governanceRouter from './modules/governance/governance.router';
import contactRouter from './modules/contact/contact.router';
import metricsRouter from './modules/metrics/metrics.router';

export const app = express();

// Security & Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
 * @openapi
 * /health:
 *   get:
 *     summary: System health check endpoint
 *     responses:
 *       200:
 *         description: Server is operational
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    service: 'aneevarp-solutions-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// Swagger API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API v1 Routes
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
  if (req.path.startsWith('/api/') || req.path.startsWith('/docs')) {
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
