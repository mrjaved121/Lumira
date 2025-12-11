/**
 * Zod validation schemas for message operations
 * Based on Figma ERD
 */

import { z } from 'zod';

/**
 * Create message schema
 * Used when sending a new message
 */
export const createMessageSchema = z.object({
  conversation: z
    .string()
    .min(1, 'Conversation ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid conversation ID format')
    .optional(), // Can be inferred from context
  content: z
    .string()
    .min(1, 'Message content is required')
    .trim(),
});

/**
 * Mark message as read schema
 * Used when marking a message as read
 */
export const markMessageReadSchema = z.object({
  messageId: z
    .string()
    .min(1, 'Message ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid message ID format'),
});

/**
 * Update message read status schema
 * Used when updating message read status
 */
export const updateMessageReadStatusSchema = z.object({
  isRead: z.boolean(),
});

/**
 * Query messages schema
 * Used for filtering and pagination
 */
export const queryMessagesSchema = z.object({
  conversation: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid conversation ID format')
    .optional(),
  sender: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid sender ID format')
    .optional(),
  isRead: z
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
    .default('50'),
  sortBy: z
    .enum(['createdAt', 'updatedAt'])
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
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type MarkMessageReadInput = z.infer<typeof markMessageReadSchema>;
export type UpdateMessageReadStatusInput = z.infer<typeof updateMessageReadStatusSchema>;
export type QueryMessagesInput = z.infer<typeof queryMessagesSchema>;
