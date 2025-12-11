/**
 * Zod validation schemas for photographer specialty operations
 */

import { z } from 'zod';

/**
 * Add specialty to photographer schema
 * Used when adding a photography type to a photographer's specialties
 */
export const addPhotographerSpecialtySchema = z.object({
  photographyType: z
    .string()
    .min(1, 'Photography type ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photography type ID format'),
});

/**
 * Remove specialty from photographer schema
 * Used when removing a photography type from a photographer's specialties
 */
export const removePhotographerSpecialtySchema = z.object({
  photographyType: z
    .string()
    .min(1, 'Photography type ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photography type ID format'),
});

/**
 * Query photographer specialties schema
 * Used for filtering and pagination
 */
export const queryPhotographerSpecialtiesSchema = z.object({
  photographer: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(),
  photographyType: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photography type ID format')
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
});

/**
 * Type exports
 */
export type AddPhotographerSpecialtyInput = z.infer<typeof addPhotographerSpecialtySchema>;
export type RemovePhotographerSpecialtyInput = z.infer<typeof removePhotographerSpecialtySchema>;
export type QueryPhotographerSpecialtiesInput = z.infer<typeof queryPhotographerSpecialtiesSchema>;

