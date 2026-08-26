import { z } from 'zod';

export const createInquirySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
    email: z.string().email('Invalid email address format').max(120, 'Email cannot exceed 120 characters'),
    company: z.string().max(150, 'Company name cannot exceed 150 characters').optional(),
    category: z
      .enum([
        'GENERAL',
        'PARTNERSHIP',
        'ENTERPRISE_LICENSING',
        'PRESS_MEDIA',
        'INVESTOR_RELATIONS',
        'CAREERS',
        'VENTURE_PITCH',
      ])
      .default('GENERAL'),
    message: z.string().min(5, 'Message must be at least 5 characters').max(4000, 'Message cannot exceed 4000 characters'),
  }),
});
