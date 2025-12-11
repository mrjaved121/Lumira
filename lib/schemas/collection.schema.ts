/**
 * Zod validation schemas for collection operations
 * Based on Figma ERD
 */

import { z } from 'zod';

/**
 * Create collection schema
 * Used when creating a new collection
 */
export const createCollectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Collection name is required')
    .max(255, 'Collection name cannot exceed 255 characters')
    .trim(),
  description: z
    .string()
    .trim()
    .optional(),
  coverPhoto: z
    .string()
    .url('Cover photo must be a valid URL')
    .trim()
    .optional(),
  isPublic: z.boolean().optional().default(false),
});

/**
 * Update collection schema
 * Used when updating collection details
 */
export const updateCollectionSchema = z.object({
  name: z
    .string()
    .min(1, 'Collection name is required')
    .max(255, 'Collection name cannot exceed 255 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .trim()
    .optional()
    .nullable(),
  coverPhoto: z
    .string()
    .url('Cover photo must be a valid URL')
    .trim()
    .optional()
    .nullable(),
  isPublic: z.boolean().optional(),
});

/**
 * Query collections schema
 * Used for filtering and pagination
 */
export const queryCollectionsSchema = z.object({
  client: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid client ID format')
    .optional(),
  isPublic: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  search: z.string().trim().optional(),
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
    .enum(['createdAt', 'updatedAt', 'name'])
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
export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type QueryCollectionsInput = z.infer<typeof queryCollectionsSchema>;
