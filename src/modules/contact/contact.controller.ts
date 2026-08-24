import { Request, Response, NextFunction } from 'express';
import { ContactService } from './contact.service';

const contactService = new ContactService();

export class ContactController {
  async submitInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const inquiry = await contactService.submitInquiry(req.body);
      return res.status(201).json({
        success: true,
        message: 'Inquiry received by Aneevarp Solutions corporate routing desk.',
        data: inquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  getCategories(req: Request, res: Response) {
    const categories = contactService.getCategories();
    return res.json({
      success: true,
      data: categories,
    });
  }
}
