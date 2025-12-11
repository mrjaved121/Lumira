/**
 * Zod validation schemas for photography type operations
 */

import { z } from 'zod';

/**
 * Create photography type schema
 * Used when creating a new photography type (admin only)
 */
export const createPhotographyTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Photography type name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  description: z
    .string()
    .trim()
    .optional(),
  icon: z
    .string()
    .max(50, 'Icon cannot exceed 50 characters')
    .trim()
    .optional(),
});

/**
 * Update photography type schema
 * Used when updating photography type details
 */
export const updatePhotographyTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Photography type name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .trim()
    .optional()
    .nullable(),
  icon: z
    .string()
    .max(50, 'Icon cannot exceed 50 characters')
    .trim()
    .optional()
    .nullable(),
});

/**
 * Query photography types schema
 * Used for filtering and pagination
 */
export const queryPhotographyTypesSchema = z.object({
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
    .enum(['name', 'createdAt'])
    .optional()
    .default('name'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('asc'),
});

/**
 * Type exports
 */
export type CreatePhotographyTypeInput = z.infer<typeof createPhotographyTypeSchema>;
export type UpdatePhotographyTypeInput = z.infer<typeof updatePhotographyTypeSchema>;
export type QueryPhotographyTypesInput = z.infer<typeof queryPhotographyTypesSchema>;

