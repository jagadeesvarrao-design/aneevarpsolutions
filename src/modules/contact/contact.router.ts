import { Router } from 'express';
import { ContactController } from './contact.controller';

const router = Router();
const controller = new ContactController();

/**
 * @openapi
 * /api/v1/contact:
 *   post:
 *     summary: Submit a inquiry or partnership proposal to Aneevarp Solutions
 *     tags: [Smart Inquiry & Contact Router]
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
 *                 enum: [GENERAL, PARTNERSHIP, ENTERPRISE_LICENSING, PRESS_MEDIA, INVESTOR_RELATIONS, CAREERS]
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact submission acknowledged
 */
router.post('/', (req, res, next) => controller.submitInquiry(req, res, next));

/**
 * @openapi
 * /api/v1/contact/categories:
 *   get:
 *     summary: List supported contact departments and categories
 *     tags: [Smart Inquiry & Contact Router]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', (req, res) => controller.getCategories(req, res));

export default router;
