import { Router } from 'express';
import { PressController } from './press.controller';
import { requireApiKey, sensitiveEndpointLimiter } from '../../middleware/security';
import { validateRequest } from '../../middleware/validate';
import { createPressReleaseSchema } from './press.schema';

const router = Router();
const controller = new PressController();

/**
 * @openapi
 * /api/v1/press:
 *   get:
 *     summary: Get all corporate press releases & media announcements
 *     tags: [Press & Newsroom]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter (e.g. Product Launch, Innovation Notice)
 *     responses:
 *       200:
 *         description: List of press releases
 */
router.get('/', (req, res, next) => controller.getPressReleases(req, res, next));

/**
 * @openapi
 * /api/v1/press/media-kit:
 *   get:
 *     summary: Retrieve official media kit, logos, and press resources
 *     tags: [Press & Newsroom]
 *     responses:
 *       200:
 *         description: Media kit details and download links
 */
router.get('/media-kit', (req, res) => controller.getMediaKit(req, res));

/**
 * @openapi
 * /api/v1/press/{slug}:
 *   get:
 *     summary: Retrieve a single press release article by slug
 *     tags: [Press & Newsroom]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Press release article details
 *       404:
 *         description: Press release not found
 */
router.get('/:slug', (req, res, next) => controller.getPressReleaseBySlug(req, res, next));

/**
 * @openapi
 * /api/v1/press:
 *   post:
 *     summary: Publish a corporate announcement or press release (Admin Protected)
 *     tags: [Press & Newsroom]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, slug, summary, content]
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               summary:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Press release published
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  sensitiveEndpointLimiter,
  requireApiKey,
  validateRequest(createPressReleaseSchema),
  (req, res, next) => controller.createPressRelease(req, res, next)
);

export default router;
