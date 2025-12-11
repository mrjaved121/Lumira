/**
 * Zod validation schemas for review operations
 * Based on Figma ERD
 */

import { z } from 'zod';

/**
 * Create review schema
 * Used when a client creates a review for a booking
 */
export const createReviewSchema = z.object({
  booking: z
    .string()
    .min(1, 'Booking ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format'),
  photographer: z
    .string()
    .min(1, 'Photographer ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(), // Can be inferred from booking
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5')
    .int('Rating must be an integer'),
  comment: z
    .string()
    .trim()
    .optional(),
  isVisible: z.boolean().optional().default(true),
});

/**
 * Update review schema
 * Used when updating an existing review
 */
export const updateReviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5')
    .int('Rating must be an integer')
    .optional(),
  comment: z
    .string()
    .trim()
    .optional()
    .nullable(),
  isVisible: z.boolean().optional(),
});

/**
 * Query reviews schema
 * Used for filtering and pagination
 */
export const queryReviewsSchema = z.object({
  photographer: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(),
  client: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid client ID format')
    .optional(),
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
    .optional(),
  rating: z
    .string()
    .regex(/^[1-5]$/)
    .transform(Number)
    .pipe(z.number().min(1).max(5))
    .optional(),
  minRating: z
    .string()
    .regex(/^[1-5]$/)
    .transform(Number)
    .pipe(z.number().min(1).max(5))
    .optional(),
  isVisible: z
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
    .default('10'),
  sortBy: z
    .enum(['createdAt', 'rating', 'updatedAt'])
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
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type QueryReviewsInput = z.infer<typeof queryReviewsSchema>;
