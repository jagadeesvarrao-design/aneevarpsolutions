import { z } from 'zod';

export const syncMetricSchema = z.object({
  body: z.object({
    ventureSlug: z
      .string()
      .min(2, 'Slug must be at least 2 characters')
      .max(60, 'Slug cannot exceed 60 characters')
      .regex(/^[a-z0-9-]+$/i, 'Invalid slug format'),
    metricKey: z
      .string()
      .min(2, 'Metric key must be at least 2 characters')
      .max(60, 'Metric key cannot exceed 60 characters')
      .regex(/^[a-z0-9_]+$/i, 'Invalid metric key format'),
    metricValue: z
      .number()
      .nonnegative('Metric value must be a non-negative number')
      .max(1000000000, 'Metric value cannot exceed 1,000,000,000'),
    metricLabel: z
      .string()
      .min(2, 'Metric label required')
      .max(120, 'Metric label cannot exceed 120 characters'),
    unit: z.string().max(30).optional(),
  }),
});
