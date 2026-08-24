import { Request, Response, NextFunction } from 'express';
import { MetricsService } from './metrics.service';

const metricsService = new MetricsService();

export class MetricsController {
  async getLiveMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await metricsService.getLiveMetrics();
      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async syncMetric(req: Request, res: Response, next: NextFunction) {
    try {
      const { ventureSlug, metricKey, metricValue, metricLabel, unit } = req.body;
      const synced = await metricsService.syncMetric(ventureSlug, metricKey, metricValue, metricLabel, unit);

      return res.status(200).json({
        success: true,
        message: 'Metric successfully updated',
        data: synced,
      });
    } catch (error) {
      next(error);
    }
  }
}
