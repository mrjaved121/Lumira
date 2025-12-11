/**
 * Zod validation schemas for photographer operations
 * Based on Figma ERD
 */

import { z } from 'zod';

/**
 * Create photographer profile schema
 * Used when a user creates their photographer profile
 */
export const createPhotographerProfileSchema = z.object({
  businessName: z
    .string()
    .max(255, 'Business name cannot exceed 255 characters')
    .trim()
    .optional(),
  bio: z
    .string()
    .trim()
    .optional(),
  yearsExperience: z
    .number()
    .int('Years of experience must be an integer')
    .min(0, 'Years of experience cannot be negative')
    .optional(),
  hourlyRate: z
    .number()
    .min(0, 'Hourly rate cannot be negative')
    .optional(),
  locationCity: z
    .string()
    .min(1, 'Location city is required')
    .max(100, 'City cannot exceed 100 characters')
    .trim(),
  locationRegion: z
    .string()
    .min(1, 'Location region is required')
    .max(100, 'Region cannot exceed 100 characters')
    .trim()
    .refine(
      (val) => val.toLowerCase().includes('quebec') || val.toLowerCase() === 'qc',
      { message: 'Location region must be Quebec-based' }
    ),
  portfolioUrl: z
    .string()
    .url('Portfolio URL must be a valid URL')
    .trim()
    .optional(),
  instagramHandle: z
    .string()
    .max(100, 'Instagram handle cannot exceed 100 characters')
    .trim()
    .optional(),
});

/**
 * Update photographer profile schema
 * Used when updating photographer profile information
 */
export const updatePhotographerProfileSchema = z.object({
  businessName: z
    .string()
    .max(255, 'Business name cannot exceed 255 characters')
    .trim()
    .optional()
    .nullable(),
  bio: z
    .string()
    .trim()
    .optional()
    .nullable(),
  yearsExperience: z
    .number()
    .int('Years of experience must be an integer')
    .min(0, 'Years of experience cannot be negative')
    .optional()
    .nullable(),
  hourlyRate: z
    .number()
    .min(0, 'Hourly rate cannot be negative')
    .optional()
    .nullable(),
  locationCity: z
    .string()
    .min(1, 'Location city is required')
    .max(100, 'City cannot exceed 100 characters')
    .trim()
    .optional(),
  locationRegion: z
    .string()
    .min(1, 'Location region is required')
    .max(100, 'Region cannot exceed 100 characters')
    .trim()
    .refine(
      (val) => val.toLowerCase().includes('quebec') || val.toLowerCase() === 'qc',
      { message: 'Location region must be Quebec-based' }
    )
    .optional(),
  portfolioUrl: z
    .string()
    .url('Portfolio URL must be a valid URL')
    .trim()
    .optional()
    .nullable(),
  instagramHandle: z
    .string()
    .max(100, 'Instagram handle cannot exceed 100 characters')
    .trim()
    .optional()
    .nullable(),
});

/**
 * Query photographers schema
 * Used for filtering and pagination
 */
export const queryPhotographersSchema = z.object({
  locationCity: z.string().trim().optional(),
  locationRegion: z.string().trim().optional(),
  photographyType: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photography type ID format')
    .optional(),
  minRating: z
    .string()
    .regex(/^[0-5](\.\d{1,2})?$/)
    .transform(Number)
    .pipe(z.number().min(0).max(5))
    .optional(),
  isVerified: z
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
    .enum(['averageRating', 'totalBookings', 'createdAt'])
    .optional()
    .default('averageRating'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
});

/**
 * Type exports
 */
export type CreatePhotographerProfileInput = z.infer<typeof createPhotographerProfileSchema>;
export type UpdatePhotographerProfileInput = z.infer<typeof updatePhotographerProfileSchema>;
export type QueryPhotographersInput = z.infer<typeof queryPhotographersSchema>;
