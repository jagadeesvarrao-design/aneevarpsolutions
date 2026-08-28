import { z } from 'zod';

export const createVentureSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
    slug: z
      .string()
      .min(2, 'Slug must be at least 2 characters')
      .max(60, 'Slug cannot exceed 60 characters')
      .regex(/^[a-z0-9-]+$/i, 'Slug can only contain alphanumeric characters and hyphens'),
    tagline: z.string().min(5, 'Tagline must be at least 5 characters').max(200, 'Tagline cannot exceed 200 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description cannot exceed 2000 characters'),
    stage: z.enum(['LIVE', 'BETA', 'INCUBATING']).default('LIVE'),
    websiteUrl: z.string().url('Invalid website URL format').max(500),
    logoUrl: z.string().max(500).optional(),
    techStack: z.array(z.string().max(50)).max(20).optional(),
    metrics: z.record(z.any()).optional(),
    isFeatured: z.boolean().optional(),
  }),
});
