import { z } from 'zod';

export const submitApplicationSchema = z.object({
  body: z.object({
    postingId: z.string().min(1, 'Posting ID is required'),
    applicantName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
    applicantEmail: z.string().email('Invalid email address format').max(120, 'Email cannot exceed 120 characters'),
    resumeUrl: z.string().url('Invalid resume URL').max(500).optional().or(z.literal('')),
    portfolioUrl: z.string().url('Invalid portfolio URL').max(500).optional().or(z.literal('')),
    coverLetter: z.string().max(4000, 'Cover letter cannot exceed 4000 characters').optional(),
  }),
});
