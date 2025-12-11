/**
 * Zod validation schemas for collection item operations
 */

import { z } from 'zod';

/**
 * Add media to collection schema
 * Used when adding media to a collection
 */
export const addMediaToCollectionSchema = z.object({
  collectionId: z
    .string()
    .min(1, 'Collection ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid collection ID format'),
  media: z
    .string()
    .min(1, 'Media ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid media ID format'),
  order: z
    .number()
    .int('Order must be an integer')
    .min(0, 'Order cannot be negative')
    .optional()
    .default(0),
});

/**
 * Update collection item order schema
 * Used when reordering items in a collection
 */
export const updateCollectionItemOrderSchema = z.object({
  order: z
    .number()
    .int('Order must be an integer')
    .min(0, 'Order cannot be negative'),
});

/**
 * Bulk add media to collection schema
 * Used when adding multiple media items at once
 */
export const bulkAddMediaToCollectionSchema = z.object({
  collectionId: z
    .string()
    .min(1, 'Collection ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid collection ID format'),
  media: z
    .array(
      z.object({
        mediaId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, 'Invalid media ID format'),
        order: z
          .number()
          .int()
          .min(0)
          .optional()
          .default(0),
      })
    )
    .min(1, 'At least one media item is required')
    .max(100, 'Cannot add more than 100 items at once'),
});

/**
 * Remove media from collection schema
 * Used when removing media from a collection
 */
export const removeMediaFromCollectionSchema = z.object({
  collectionId: z
    .string()
    .min(1, 'Collection ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid collection ID format'),
  media: z
    .string()
    .min(1, 'Media ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid media ID format'),
});

/**
 * Query collection items schema
 * Used for filtering and pagination
 */
export const queryCollectionItemsSchema = z.object({
  collectionId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid collection ID format')
    .optional(),
  media: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid media ID format')
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
    .enum(['order', 'addedAt', 'createdAt'])
    .optional()
    .default('order'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('asc'),
});

/**
 * Type exports
 */
export type AddMediaToCollectionInput = z.infer<typeof addMediaToCollectionSchema>;
export type UpdateCollectionItemOrderInput = z.infer<typeof updateCollectionItemOrderSchema>;
export type BulkAddMediaToCollectionInput = z.infer<typeof bulkAddMediaToCollectionSchema>;
export type RemoveMediaFromCollectionInput = z.infer<typeof removeMediaFromCollectionSchema>;
export type QueryCollectionItemsInput = z.infer<typeof queryCollectionItemsSchema>;

