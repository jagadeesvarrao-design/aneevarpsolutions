import { Router } from 'express';
import { VenturesController } from './ventures.controller';
import { requireApiKey, sensitiveEndpointLimiter } from '../../middleware/security';
import { validateRequest } from '../../middleware/validate';
import { createVentureSchema } from './ventures.schema';

const router = Router();
const controller = new VenturesController();

/**
 * @openapi
 * /api/v1/ventures:
 *   get:
 *     summary: List all portfolio products and subsidiary ventures
 *     tags: [Ventures]
 *     parameters:
 *       - in: query
 *         name: stage
 *         schema:
 *           type: string
 *           enum: [LIVE, BETA, INCUBATING]
 *         description: Filter by venture stage
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Return only featured ventures
 *     responses:
 *       200:
 *         description: List of Aneevarp portfolio products
 */
router.get('/', (req, res, next) => controller.getVentures(req, res, next));

/**
 * @openapi
 * /api/v1/ventures/{slug}:
 *   get:
 *     summary: Get detailed venture information by slug (e.g. zenresume, ai-job-search-agent)
 *     tags: [Ventures]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venture details with active job postings
 *       404:
 *         description: Venture not found
 */
router.get('/:slug', (req, res, next) => controller.getVentureBySlug(req, res, next));

/**
 * @openapi
 * /api/v1/ventures:
 *   post:
 *     summary: Register a new incubated product in the Aneevarp Solutions portfolio (Admin Protected)
 *     tags: [Ventures]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug, tagline, description, websiteUrl]
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               tagline:
 *                 type: string
 *               description:
 *                 type: string
 *               websiteUrl:
 *                 type: string
 *               techStack:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Venture registered successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  sensitiveEndpointLimiter,
  requireApiKey,
  validateRequest(createVentureSchema),
  (req, res, next) => controller.createVenture(req, res, next)
);

export default router;
