import { Request, Response, NextFunction } from 'express';
import { VenturesService, VentureStageType } from './ventures.service';

const venturesService = new VenturesService();

export class VenturesController {
  async getVentures(req: Request, res: Response, next: NextFunction) {
    try {
      const stage = req.query.stage as VentureStageType | undefined;
      const featured = req.query.featured === 'true';
      const ventures = await venturesService.getAllVentures(stage, featured);

      return res.json({
        success: true,
        count: ventures.length,
        data: ventures,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVentureBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const venture = await venturesService.getVentureBySlug(slug);

      if (!venture) {
        return res.status(404).json({
          success: false,
          error: { message: `Venture with slug '${slug}' not found` },
        });
      }

      return res.json({
        success: true,
        data: venture,
      });
    } catch (error) {
      next(error);
    }
  }

  async createVenture(req: Request, res: Response, next: NextFunction) {
    try {
      const newVenture = await venturesService.createVenture(req.body);
      return res.status(201).json({
        success: true,
        data: newVenture,
      });
    } catch (error) {
      next(error);
    }
  }
}
