import { z } from 'zod';

export const createPressReleaseSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title cannot exceed 200 characters'),
    slug: z
      .string()
      .min(2, 'Slug must be at least 2 characters')
      .max(80, 'Slug cannot exceed 80 characters')
      .regex(/^[a-z0-9-]+$/i, 'Slug can only contain alphanumeric characters and hyphens'),
    summary: z.string().min(10, 'Summary must be at least 10 characters').max(500, 'Summary cannot exceed 500 characters'),
    content: z.string().min(20, 'Content must be at least 20 characters').max(15000, 'Content cannot exceed 15000 characters'),
    category: z.string().max(50).optional(),
    author: z.string().max(100).optional(),
    mediaAssetsUrl: z.string().max(500).optional(),
  }),
});
