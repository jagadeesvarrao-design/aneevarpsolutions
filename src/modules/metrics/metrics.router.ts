import { Router } from 'express';
import { MetricsController } from './metrics.controller';
import { requireApiKey, sensitiveEndpointLimiter } from '../../middleware/security';

const router = Router();
const controller = new MetricsController();

/**
 * @openapi
 * /api/v1/metrics/live:
 *   get:
 *     summary: Retrieve real-time aggregated ecosystem metrics across ZenResume, AI Job Search, PDF Bot, and parent operations
 *     tags: [Ecosystem Telemetry]
 *     responses:
 *       200:
 *         description: Live metrics and venture breakdowns
 */
router.get('/live', (req, res, next) => controller.getLiveMetrics(req, res, next));

/**
 * @openapi
 * /api/v1/metrics/sync:
 *   post:
 *     summary: Secure endpoint for subsidiary products (ZenResume, AI Job Search, PDF Bot) to report live stats
 *     tags: [Ecosystem Telemetry]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ventureSlug, metricKey, metricValue, metricLabel]
 *             properties:
 *               ventureSlug:
 *                 type: string
 *               metricKey:
 *                 type: string
 *               metricValue:
 *                 type: number
 *               metricLabel:
 *                 type: string
 *               unit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Metric updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/sync', sensitiveEndpointLimiter, requireApiKey, (req, res, next) =>
  controller.syncMetric(req, res, next)
);

export default router;
