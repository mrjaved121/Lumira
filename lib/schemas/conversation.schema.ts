/**
 * Zod validation schemas for conversation operations
 * Based on Figma ERD
 */

import { z } from 'zod';

/**
 * Create conversation schema
 * Used when creating a new conversation
 */
export const createConversationSchema = z.object({
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
    .optional(),
  client: z
    .string()
    .min(1, 'Client ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid client ID format')
    .optional(), // Can be inferred from auth context
  photographer: z
    .string()
    .min(1, 'Photographer ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format'),
});

/**
 * Update conversation schema
 * Used when updating conversation details (limited fields)
 */
export const updateConversationSchema = z.object({
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
    .optional()
    .nullable(),
});

/**
 * Query conversations schema
 * Used for filtering and pagination
 */
export const queryConversationsSchema = z.object({
  client: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid client ID format')
    .optional(),
  photographer: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(),
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
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
    .enum(['lastMessageAt', 'createdAt'])
    .optional()
    .default('lastMessageAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
});

/**
 * Type exports
 */
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type QueryConversationsInput = z.infer<typeof queryConversationsSchema>;
