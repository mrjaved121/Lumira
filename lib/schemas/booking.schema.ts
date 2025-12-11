/**
 * Zod validation schemas for booking operations
 * Based on Figma ERD
 */

import { z } from 'zod';
import { BookingStatus } from '@/lib/constants/enums';

/**
 * Create booking schema
 * Used when a customer creates a new booking request
 */
export const createBookingSchema = z.object({
  photographer: z
    .string()
    .min(1, 'Photographer ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format'),
  photographyType: z
    .string()
    .min(1, 'Photography type ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photography type ID format'),
  bookingDate: z
    .string()
    .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
    .or(z.date())
    .refine(
      (date) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d > new Date();
      },
      { message: 'Booking date must be in the future' }
    ),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format (24-hour)'),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format (24-hour)'),
  locationAddress: z
    .string()
    .min(1, 'Location address is required')
    .trim(),
  locationCity: z
    .string()
    .min(1, 'Location city is required')
    .max(100, 'City cannot exceed 100 characters')
    .trim(),
  totalAmount: z
    .number()
    .positive('Total amount must be positive'),
  specialRequests: z
    .string()
    .trim()
    .optional(),
}).refine(
  (data) => {
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes > startMinutes;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

/**
 * Update booking schema
 * Used when updating booking details (by client or photographer)
 */
export const updateBookingSchema = z.object({
  bookingDate: z
    .string()
    .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
    .or(z.date())
    .refine(
      (date) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d > new Date();
      },
      { message: 'Booking date must be in the future' }
    )
    .optional(),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format (24-hour)')
    .optional(),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format (24-hour)')
    .optional(),
  locationAddress: z
    .string()
    .min(1, 'Location address is required')
    .trim()
    .optional(),
  locationCity: z
    .string()
    .min(1, 'Location city is required')
    .max(100, 'City cannot exceed 100 characters')
    .trim()
    .optional(),
  totalAmount: z
    .number()
    .positive('Total amount must be positive')
    .optional(),
  specialRequests: z
    .string()
    .trim()
    .optional()
    .nullable(),
}).refine(
  (data) => {
    if (data.startTime && data.endTime) {
      const [startHour, startMin] = data.startTime.split(':').map(Number);
      const [endHour, endMin] = data.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      return endMinutes > startMinutes;
    }
    return true;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
);

/**
 * Update booking status schema
 * Used by photographers to accept/decline bookings, or mark as completed
 */
export const updateBookingStatusSchema = z.object({
  status: z.enum(
    [
      BookingStatus.CONFIRMED,
      BookingStatus.IN_PROGRESS,
      BookingStatus.COMPLETED,
      BookingStatus.DELIVERED,
      BookingStatus.CANCELLED,
      BookingStatus.REFUNDED,
      BookingStatus.DECLINED,
    ],
    {
      errorMap: () => ({
        message: 'Invalid booking status',
      }),
    }
  ),
  cancellationReason: z
    .string()
    .trim()
    .optional(),
});

/**
 * Query bookings schema
 * Used for filtering and pagination
 */
export const queryBookingsSchema = z.object({
  status: z
    .enum(Object.values(BookingStatus) as [string, ...string[]])
    .optional(),
  photographer: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(),
  client: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid client ID format')
    .optional(),
  photographyType: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photography type ID format')
    .optional(),
  locationCity: z.string().trim().optional(),
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
    .default('10'),
  sortBy: z
    .enum(['bookingDate', 'createdAt', 'totalAmount'])
    .optional()
    .default('bookingDate'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
});

/**
 * Type exports
 */
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type QueryBookingsInput = z.infer<typeof queryBookingsSchema>;
