import { Request, Response, NextFunction } from 'express';
import { GovernanceService, PolicyTypeCategory } from './governance.service';

const governanceService = new GovernanceService();

export class GovernanceController {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await governanceService.getOverview();
      return res.json({
        success: true,
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await governanceService.getExecutiveTeam();
      return res.json({
        success: true,
        data: team,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPolicies(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as PolicyTypeCategory | undefined;
      const policies = await governanceService.getPolicies(type);
      return res.json({
        success: true,
        data: policies,
      });
    } catch (error) {
      next(error);
    }
  }
}
