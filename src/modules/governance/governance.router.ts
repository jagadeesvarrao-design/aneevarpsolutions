import { Router } from 'express';
import { GovernanceController } from './governance.controller';

const router = Router();
const controller = new GovernanceController();

/**
 * @openapi
 * /api/v1/governance/overview:
 *   get:
 *     summary: Retrieve corporate vision, mission, and company overview for Aneevarp Solutions
 *     tags: [Governance & Investor Relations]
 *     responses:
 *       200:
 *         description: Corporate overview summary
 */
router.get('/overview', (req, res, next) => controller.getOverview(req, res, next));

/**
 * @openapi
 * /api/v1/governance/team:
 *   get:
 *     summary: Retrieve executive leadership and advisory board members
 *     tags: [Governance & Investor Relations]
 *     responses:
 *       200:
 *         description: Executive team profiles
 */
router.get('/team', (req, res, next) => controller.getTeam(req, res, next));

/**
 * @openapi
 * /api/v1/governance/policies:
 *   get:
 *     summary: Retrieve official corporate policies (Privacy, AI Ethics, Terms, ESG)
 *     tags: [Governance & Investor Relations]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PRIVACY, TERMS, AI_ETHICS, ESG, GOVERNANCE]
 *     responses:
 *       200:
 *         description: Corporate policy articles
 */
router.get('/policies', (req, res, next) => controller.getPolicies(req, res, next));

export default router;
