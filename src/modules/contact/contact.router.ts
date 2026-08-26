import { Router } from 'express';
import { ContactController } from './contact.controller';
import { validateRequest } from '../../middleware/validate';
import { createInquirySchema } from './contact.schema';
import { submissionRateLimiter } from '../../middleware/security';

const router = Router();
const controller = new ContactController();

/**
 * @openapi
 * /api/v1/contact:
 *   post:
 *     summary: Submit an inquiry, grievance, or partnership proposal to Aneevarp Solutions
 *     tags: [Contact & Venture Pitch]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               company:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [GENERAL, PARTNERSHIP, ENTERPRISE_LICENSING, PRESS_MEDIA, INVESTOR_RELATIONS, CAREERS, VENTURE_PITCH]
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact submission acknowledged
 *       429:
 *         description: Rate limit exceeded
 */
router.post(
  '/',
  submissionRateLimiter,
  validateRequest(createInquirySchema),
  (req, res, next) => controller.submitInquiry(req, res, next)
);

/**
 * @openapi
 * /api/v1/contact/categories:
 *   get:
 *     summary: List supported contact departments and categories
 *     tags: [Contact & Venture Pitch]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', (req, res) => controller.getCategories(req, res));

export default router;
