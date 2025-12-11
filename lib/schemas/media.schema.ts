/**
 * Zod validation schemas for media operations
 */

import { z } from 'zod';
import { MediaType } from '@/lib/models/Media';

/**
 * Create media schema
 * Used when uploading new media (photo or video)
 */
export const createMediaSchema = z.object({
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
    .optional(),
  photographer: z
    .string()
    .min(1, 'Photographer ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(), // Can be inferred from auth context
  url: z
    .string()
    .url('Media URL must be a valid URL')
    .min(1, 'Media URL is required'),
  thumbnailUrl: z
    .string()
    .url('Thumbnail URL must be a valid URL')
    .optional(),
  type: z.enum(Object.values(MediaType) as [string, ...string[]], {
    errorMap: () => ({ message: 'Media type must be either photo or video' }),
  }),
  title: z
    .string()
    .max(255, 'Title cannot exceed 255 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .trim()
    .optional(),
  isPortfolio: z.boolean().optional().default(false),
});

/**
 * Update media schema
 * Used when updating media details
 */
export const updateMediaSchema = z.object({
  url: z
    .string()
    .url('Media URL must be a valid URL')
    .optional(),
  thumbnailUrl: z
    .string()
    .url('Thumbnail URL must be a valid URL')
    .optional()
    .nullable(),
  title: z
    .string()
    .max(255, 'Title cannot exceed 255 characters')
    .trim()
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .optional()
    .nullable(),
  isPortfolio: z.boolean().optional(),
});

/**
 * Query media schema
 * Used for filtering and pagination
 */
export const queryMediaSchema = z.object({
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
    .optional(),
  photographer: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(),
  type: z
    .enum(Object.values(MediaType) as [string, ...string[]])
    .optional(),
  isPortfolio: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().min(1))
    .optional()
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().min(1).max(100))
    .optional()
    .default('20'),
  sortBy: z
    .enum(['createdAt', 'title'])
    .optional()
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
});

/**
 * Type exports
 */
export type CreateMediaInput = z.infer<typeof createMediaSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;
export type QueryMediaInput = z.infer<typeof queryMediaSchema>;

