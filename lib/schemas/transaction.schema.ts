/**
 * Zod validation schemas for transaction operations
 */

import { z } from 'zod';
import { TransactionType, TransactionStatus } from '@/lib/constants/enums';

/**
 * Create transaction schema
 * Used when creating a new transaction (typically by system, not user)
 */
export const createTransactionSchema = z.object({
  user: z
    .string()
    .min(1, 'User ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .optional(), // Can be inferred from auth context
  type: z.enum(Object.values(TransactionType) as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid transaction type' }),
  }),
  amount: z
    .number()
    .positive('Transaction amount must be positive'),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code (e.g., CAD, USD)')
    .toUpperCase()
    .optional()
    .default('CAD'),
  status: z.enum(Object.values(TransactionStatus) as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid transaction status' }),
  }),
  description: z
    .string()
    .min(1, 'Transaction description is required')
    .max(500, 'Description cannot exceed 500 characters')
    .trim(),
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
    .optional(),
  paymentMethod: z
    .string()
    .max(100, 'Payment method cannot exceed 100 characters')
    .trim()
    .optional(),
  transactionId: z
    .string()
    .max(200, 'Transaction ID cannot exceed 200 characters')
    .trim()
    .optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Update transaction status schema
 * Used when updating transaction status (e.g., marking as completed)
 */
export const updateTransactionStatusSchema = z.object({
  status: z.enum(Object.values(TransactionStatus) as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid transaction status' }),
  }),
  transactionId: z
    .string()
    .max(200, 'Transaction ID cannot exceed 200 characters')
    .trim()
    .optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Query transactions schema
 * Used for filtering and pagination
 */
export const queryTransactionsSchema = z.object({
  user: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format')
    .optional(),
  type: z
    .enum(Object.values(TransactionType) as [string, ...string[]])
    .optional(),
  status: z
    .enum(Object.values(TransactionStatus) as [string, ...string[]])
    .optional(),
  booking: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking ID format')
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
  minAmount: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .pipe(z.number().min(0))
    .optional(),
  maxAmount: z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform(Number)
    .pipe(z.number().min(0))
    .optional(),
  currency: z
    .string()
    .length(3)
    .toUpperCase()
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
    .enum(['createdAt', 'amount', 'updatedAt'])
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
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionStatusInput = z.infer<typeof updateTransactionStatusSchema>;
export type QueryTransactionsInput = z.infer<typeof queryTransactionsSchema>;


