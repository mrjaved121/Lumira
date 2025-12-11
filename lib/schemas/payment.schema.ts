/**
 * Zod validation schemas for payment operations
 */

import { z } from 'zod';
import { PaymentStatus, PaymentMethodType } from '@/lib/constants/enums';

/**
 * Create payment schema
 * Used when creating a new payment record
 */
export const createPaymentSchema = z.object({
  booking: z
    .string()
    .min(1, 'Booking ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format'),
  amount: z
    .number()
    .positive('Payment amount must be positive'),
  commission: z
    .number()
    .min(0, 'Commission cannot be negative'),
  paymentMethod: z.enum(Object.values(PaymentMethodType) as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid payment method' }),
  }),
  paymentStatus: z.enum(Object.values(PaymentStatus) as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid payment status' }),
  }).optional().default(PaymentStatus.PENDING),
  stripePaymentId: z
    .string()
    .max(255, 'Stripe payment ID cannot exceed 255 characters')
    .trim()
    .optional(),
});

/**
 * Update payment status schema
 * Used when updating payment status
 */
export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(Object.values(PaymentStatus) as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid payment status' }),
  }),
  stripePaymentId: z
    .string()
    .max(255, 'Stripe payment ID cannot exceed 255 characters')
    .trim()
    .optional(),
  paidAt: z
    .string()
    .datetime()
    .or(z.date())
    .optional(),
  refundedAt: z
    .string()
    .datetime()
    .or(z.date())
    .optional(),
});

/**
 * Query payments schema
 * Used for filtering and pagination
 */
export const queryPaymentsSchema = z.object({
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
    .optional(),
  paymentStatus: z
    .enum(Object.values(PaymentStatus) as [string, ...string[]])
    .optional(),
  paymentMethod: z
    .enum(Object.values(PaymentMethodType) as [string, ...string[]])
    .optional(),
  stripePaymentId: z
    .string()
    .trim()
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
    .enum(['createdAt', 'amount', 'paidAt'])
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
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;
export type QueryPaymentsInput = z.infer<typeof queryPaymentsSchema>;

