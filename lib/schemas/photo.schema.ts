/**
 * Zod validation schemas for photo operations
 */

import { z } from 'zod';

/**
 * Create photo schema
 * Used when uploading a new photo
 */
export const createPhotoSchema = z.object({
  photographer: z
    .string()
    .min(1, 'Photographer ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(), // Optional because it can be inferred from auth context
  title: z
    .string()
    .max(200, 'Title cannot exceed 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim()
    .optional(),
  imageUrl: z
    .string()
    .url('Image URL must be a valid URL')
    .min(1, 'Image URL is required'),
  thumbnailUrl: z
    .string()
    .url('Thumbnail URL must be a valid URL')
    .optional(),
  category: z
    .string()
    .max(100, 'Category cannot exceed 100 characters')
    .trim()
    .optional(),
  tags: z
    .array(z.string().trim())
    .max(20, 'Cannot have more than 20 tags')
    .optional(),
  location: z
    .object({
      city: z
        .string()
        .max(100, 'City cannot exceed 100 characters')
        .trim()
        .optional(),
      province: z
        .string()
        .max(100, 'Province cannot exceed 100 characters')
        .trim()
        .optional(),
    })
    .optional(),
  equipment: z
    .object({
      camera: z
        .string()
        .max(200, 'Camera name cannot exceed 200 characters')
        .trim()
        .optional(),
      lens: z
        .string()
        .max(200, 'Lens name cannot exceed 200 characters')
        .trim()
        .optional(),
      settings: z
        .string()
        .max(200, 'Settings cannot exceed 200 characters')
        .trim()
        .optional(),
    })
    .optional(),
  isPortfolio: z.boolean().optional().default(true),
  isPublic: z.boolean().optional().default(true),
  collection: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid collection ID format')
    .optional(),
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
    .optional(),
  metadata: z
    .object({
      width: z.number().min(0, 'Width cannot be negative').optional(),
      height: z.number().min(0, 'Height cannot be negative').optional(),
      fileSize: z.number().min(0, 'File size cannot be negative').optional(),
      format: z
        .string()
        .max(50, 'Format cannot exceed 50 characters')
        .trim()
        .optional(),
    })
    .optional(),
});

/**
 * Update photo schema
 * Used when updating photo details
 */
export const updatePhotoSchema = z.object({
  title: z
    .string()
    .max(200, 'Title cannot exceed 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim()
    .optional(),
  imageUrl: z
    .string()
    .url('Image URL must be a valid URL')
    .optional(),
  thumbnailUrl: z
    .string()
    .url('Thumbnail URL must be a valid URL')
    .optional(),
  category: z
    .string()
    .max(100, 'Category cannot exceed 100 characters')
    .trim()
    .optional(),
  tags: z
    .array(z.string().trim())
    .max(20, 'Cannot have more than 20 tags')
    .optional(),
  location: z
    .object({
      city: z
        .string()
        .max(100, 'City cannot exceed 100 characters')
        .trim()
        .optional(),
      province: z
        .string()
        .max(100, 'Province cannot exceed 100 characters')
        .trim()
        .optional(),
    })
    .optional(),
  equipment: z
    .object({
      camera: z
        .string()
        .max(200, 'Camera name cannot exceed 200 characters')
        .trim()
        .optional(),
      lens: z
        .string()
        .max(200, 'Lens name cannot exceed 200 characters')
        .trim()
        .optional(),
      settings: z
        .string()
        .max(200, 'Settings cannot exceed 200 characters')
        .trim()
        .optional(),
    })
    .optional(),
  isPortfolio: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  collection: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid collection ID format')
    .optional()
    .nullable(),
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
    .optional()
    .nullable(),
});

/**
 * Favorite photo schema
 * Used when adding/removing a photo from favorites
 */
export const favoritePhotoSchema = z.object({
  photoId: z
    .string()
    .min(1, 'Photo ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photo ID format'),
  action: z.enum(['add', 'remove'], {
    errorMap: () => ({ message: 'Action must be either "add" or "remove"' }),
  }),
});

/**
 * Query photos schema
 * Used for filtering and pagination
 */
export const queryPhotosSchema = z.object({
  photographer: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(),
  category: z.string().trim().optional(),
  tags: z
    .string()
    .transform((val) => (val ? val.split(',').map((t) => t.trim()) : []))
    .pipe(z.array(z.string()))
    .optional(),
  location: z
    .object({
      city: z.string().trim().optional(),
      province: z.string().trim().optional(),
    })
    .optional(),
  isPortfolio: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  isPublic: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  collection: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid collection ID format')
    .optional(),
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
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
    .enum(['createdAt', 'likes', 'views', 'favoriteCount'])
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
export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;
export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;
export type FavoritePhotoInput = z.infer<typeof favoritePhotoSchema>;
export type QueryPhotosInput = z.infer<typeof queryPhotosSchema>;


