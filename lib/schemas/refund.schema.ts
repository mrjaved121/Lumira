/**
 * Zod validation schemas for refund operations
 */

import { z } from 'zod';
import { RefundPolicyTier, RefundStatus } from '@/lib/models/Refund';

/**
 * Create refund schema
 * Used when creating a refund request
 */
export const createRefundSchema = z.object({
  payment: z
    .string()
    .min(1, 'Payment ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid payment ID format'),
  booking: z
    .string()
    .min(1, 'Booking ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format'),
  refundAmount: z
    .number()
    .positive('Refund amount must be positive'),
  refundPercentage: z
    .number()
    .min(0, 'Refund percentage cannot be negative')
    .max(100, 'Refund percentage cannot exceed 100'),
  refundPolicyTier: z.enum(Object.values(RefundPolicyTier) as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid refund policy tier' }),
  }),
  reason: z
    .string()
    .min(1, 'Refund reason is required')
    .trim(),
  status: z.enum(Object.values(RefundStatus) as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid refund status' }),
  }).optional().default(RefundStatus.PENDING),
});

/**
 * Update refund status schema
 * Used when updating refund status (admin)
 */
export const updateRefundStatusSchema = z.object({
  status: z.enum(Object.values(RefundStatus) as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid refund status' }),
  }),
  processedAt: z
    .string()
    .datetime()
    .or(z.date())
    .optional(),
});

/**
 * Query refunds schema
 * Used for filtering and pagination
 */
export const queryRefundsSchema = z.object({
  payment: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid payment ID format')
    .optional(),
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
    .optional(),
  status: z
    .enum(Object.values(RefundStatus) as [string, ...string[]])
    .optional(),
  refundPolicyTier: z
    .enum(Object.values(RefundPolicyTier) as [string, ...string[]])
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
    .enum(['createdAt', 'refundAmount', 'processedAt'])
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
export type CreateRefundInput = z.infer<typeof createRefundSchema>;
export type UpdateRefundStatusInput = z.infer<typeof updateRefundStatusSchema>;
export type QueryRefundsInput = z.infer<typeof queryRefundsSchema>;

