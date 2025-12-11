/**
 * Zod validation schemas for blocked date operations
 */

import { z } from 'zod';

/**
 * Create blocked date schema
 * Used when blocking a date
 */
export const createBlockedDateSchema = z.object({
  photographer: z
    .string()
    .min(1, 'Photographer ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(), // Can be inferred from auth context
  date: z
    .string()
    .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
    .or(z.date())
    .refine(
      (date) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        return d >= today;
      },
      { message: 'Blocked date cannot be in the past' }
    ),
  reason: z
    .string()
    .max(255, 'Reason cannot exceed 255 characters')
    .trim()
    .optional(),
});

/**
 * Update blocked date schema
 * Used when updating blocked date details
 */
export const updateBlockedDateSchema = z.object({
  date: z
    .string()
    .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
    .or(z.date())
    .refine(
      (date) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        return d >= today;
      },
      { message: 'Blocked date cannot be in the past' }
    )
    .optional(),
  reason: z
    .string()
    .max(255, 'Reason cannot exceed 255 characters')
    .trim()
    .optional()
    .nullable(),
});

/**
 * Bulk create blocked dates schema
 * Used when blocking multiple dates at once
 */
export const bulkCreateBlockedDatesSchema = z.object({
  dates: z
    .array(
      z.object({
        date: z
          .string()
          .datetime()
          .or(z.date())
          .refine(
            (date) => {
              const d = typeof date === 'string' ? new Date(date) : date;
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              d.setHours(0, 0, 0, 0);
              return d >= today;
            },
            { message: 'Blocked date cannot be in the past' }
          ),
        reason: z
          .string()
          .max(255, 'Reason cannot exceed 255 characters')
          .trim()
          .optional(),
      })
    )
    .min(1, 'At least one date is required')
    .max(365, 'Cannot block more than 365 dates at once'),
});

/**
 * Query blocked dates schema
 * Used for filtering
 */
export const queryBlockedDatesSchema = z.object({
  photographer: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
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
    .enum(['date', 'createdAt'])
    .optional()
    .default('date'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('asc'),
});

/**
 * Type exports
 */
export type CreateBlockedDateInput = z.infer<typeof createBlockedDateSchema>;
export type UpdateBlockedDateInput = z.infer<typeof updateBlockedDateSchema>;
export type BulkCreateBlockedDatesInput = z.infer<typeof bulkCreateBlockedDatesSchema>;
export type QueryBlockedDatesInput = z.infer<typeof queryBlockedDatesSchema>;

