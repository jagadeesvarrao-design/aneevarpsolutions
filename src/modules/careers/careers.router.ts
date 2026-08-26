import { Router } from 'express';
import { CareersController } from './careers.controller';
import { validateRequest } from '../../middleware/validate';
import { submitApplicationSchema } from './careers.schema';
import { submissionRateLimiter, requireApiKey } from '../../middleware/security';

const router = Router();
const controller = new CareersController();

/**
 * @openapi
 * /api/v1/careers:
 *   get:
 *     summary: List open career positions across Aneevarp parent company and portfolio ventures
 *     tags: [Careers & Talent Desk]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE]
 *     responses:
 *       200:
 *         description: List of active job openings
 */
router.get('/', (req, res, next) => controller.getJobPostings(req, res, next));

/**
 * @openapi
 * /api/v1/careers/apply:
 *   post:
 *     summary: Submit a candidate job application for a career position
 *     tags: [Careers & Talent Desk]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [postingId, applicantName, applicantEmail]
 *             properties:
 *               postingId:
 *                 type: string
 *               applicantName:
 *                 type: string
 *               applicantEmail:
 *                 type: string
 *               resumeUrl:
 *                 type: string
 *               portfolioUrl:
 *                 type: string
 *               coverLetter:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 */
router.post(
  '/apply',
  submissionRateLimiter,
  validateRequest(submitApplicationSchema),
  (req, res, next) => controller.submitJobApplication(req, res, next)
);

/**
 * @openapi
 * /api/v1/careers/{id}:
 *   get:
 *     summary: Retrieve single job posting details
 *     tags: [Careers & Talent Desk]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job posting details
 *       404:
 *         description: Job posting not found
 */
router.get('/:id', (req, res, next) => controller.getJobPostingById(req, res, next));

/**
 * @openapi
 * /api/v1/careers:
 *   post:
 *     summary: Create a new job opening (Admin Protected)
 *     tags: [Careers & Talent Desk]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       201:
 *         description: Job posting created
 */
router.post('/', requireApiKey, (req, res, next) => controller.createJobPosting(req, res, next));

export default router;
