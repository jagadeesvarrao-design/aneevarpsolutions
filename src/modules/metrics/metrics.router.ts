import { Router } from 'express';
import { MetricsController } from './metrics.controller';

const router = Router();
const controller = new MetricsController();

/**
 * @openapi
 * /api/v1/metrics/live:
 *   get:
 *     summary: Retrieve real-time aggregated ecosystem metrics across ZenResume, AI Job Search, and parent operations
 *     tags: [Ecosystem Telemetry & Live Stats]
 *     responses:
 *       200:
 *         description: Live metrics and venture breakdowns
 */
router.get('/live', (req, res, next) => controller.getLiveMetrics(req, res, next));

/**
 * @openapi
 * /api/v1/metrics/sync:
 *   post:
 *     summary: Endpoint for subsidiary products (ZenResume, AI Job Search) to report live stats
 *     tags: [Ecosystem Telemetry & Live Stats]
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
 */
router.post('/sync', (req, res, next) => controller.syncMetric(req, res, next));

export default router;
