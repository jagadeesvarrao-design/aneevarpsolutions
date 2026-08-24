import { Request, Response, NextFunction } from 'express';
import { CareersService, JobTypeCategory } from './careers.service';

const careersService = new CareersService();

export class CareersController {
  async getJobPostings(req: Request, res: Response, next: NextFunction) {
    try {
      const department = req.query.department as string | undefined;
      const location = req.query.location as string | undefined;
      const type = req.query.type as JobTypeCategory | undefined;

      const postings = await careersService.getAllJobPostings(department, location, type);

      return res.json({
        success: true,
        count: postings.length,
        data: postings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobPostingById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const posting = await careersService.getJobPostingById(id);

      if (!posting) {
        return res.status(404).json({
          success: false,
          error: { message: `Job position '${id}' not found` },
        });
      }

      return res.json({
        success: true,
        data: posting,
      });
    } catch (error) {
      next(error);
    }
  }

  async createJobPosting(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await careersService.createJobPosting(req.body);
      return res.status(201).json({
        success: true,
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  async submitJobApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await careersService.submitJobApplication(req.body);
      return res.status(201).json({
        success: true,
        message: 'Job application successfully received by Aneevarp Solutions recruitment team.',
        data: application,
      });
    } catch (error: any) {
      if (error.message.includes('does not exist')) {
        return res.status(400).json({
          success: false,
          error: { message: error.message },
        });
      }
      next(error);
    }
  }
}
