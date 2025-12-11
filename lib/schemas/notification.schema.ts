/**
 * Zod validation schemas for notification operations
 */

import { z } from 'zod';
import { NotificationType } from '@/lib/constants/enums';

/**
 * Create notification schema
 * Used when creating a new notification (typically by system, not user)
 */
export const createNotificationSchema = z.object({
  user: z
    .string()
    .min(1, 'User ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  type: z.enum(Object.values(NotificationType) as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid notification type' }),
  }),
  title: z
    .string()
    .min(1, 'Notification title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  message: z
    .string()
    .min(1, 'Notification message is required')
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim(),
  actionUrl: z
    .string()
    .url('Action URL must be a valid URL')
    .max(500, 'Action URL cannot exceed 500 characters')
    .trim()
    .optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Mark notification as read schema
 * Used when marking a notification as read
 */
export const markNotificationReadSchema = z.object({
  notificationId: z
    .string()
    .min(1, 'Notification ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid notification ID format'),
});

/**
 * Mark all notifications as read schema
 * Used when marking all user notifications as read
 */
export const markAllNotificationsReadSchema = z.object({
  // No fields needed - uses authenticated user
}).optional();

/**
 * Delete notification schema
 * Used when deleting a notification
 */
export const deleteNotificationSchema = z.object({
  notificationId: z
    .string()
    .min(1, 'Notification ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid notification ID format'),
});

/**
 * Query notifications schema
 * Used for filtering and pagination
 */
export const queryNotificationsSchema = z.object({
  user: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .optional(), // Can be inferred from auth context
  type: z
    .enum(Object.values(NotificationType) as [string, ...string[]])
    .optional(),
  isRead: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  dateFrom: z
    .string()
    .datetime()
    .or(z.date())
    .optional(),
  dateTo: z
    .string()
    .datetime()
    .or(z.date())
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
    .enum(['createdAt', 'readAt', 'updatedAt'])
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
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>;
export type MarkAllNotificationsReadInput = z.infer<typeof markAllNotificationsReadSchema>;
export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>;
export type QueryNotificationsInput = z.infer<typeof queryNotificationsSchema>;


