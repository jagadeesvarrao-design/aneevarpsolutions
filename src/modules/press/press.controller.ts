import { Request, Response, NextFunction } from 'express';
import { PressService } from './press.service';

const pressService = new PressService();

export class PressController {
  async getPressReleases(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const releases = await pressService.getAllPressReleases(category);

      return res.json({
        success: true,
        count: releases.length,
        data: releases,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPressReleaseBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const release = await pressService.getPressReleaseBySlug(slug);

      if (!release) {
        return res.status(404).json({
          success: false,
          error: { message: `Press release with slug '${slug}' not found` },
        });
      }

      return res.json({
        success: true,
        data: release,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPressRelease(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await pressService.createPressRelease(req.body);
      return res.status(201).json({
        success: true,
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  getMediaKit(req: Request, res: Response) {
    const kit = pressService.getMediaKit();
    return res.json({
      success: true,
      data: kit,
    });
  }
}
