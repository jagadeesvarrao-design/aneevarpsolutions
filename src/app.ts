import express from 'express';
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

// Serve Static Frontend UI (Stitch Integrated Portal)
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
app.get('/health', (req, res) => {
  res.json({
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

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

// Global Error Handler
app.use(errorHandler);
