/**
 * Zod validation schemas for availability operations
 */

import { z } from 'zod';
import { DayOfWeek } from '@/lib/models/Availability';

/**
 * Create availability schema
 * Used when creating/updating availability for a day
 */
export const createAvailabilitySchema = z.object({
  photographer: z
    .string()
    .min(1, 'Photographer ID is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(), // Can be inferred from auth context
  dayOfWeek: z
    .number()
    .int('Day of week must be an integer')
    .min(0, 'Day of week must be between 0 and 6 (0=Sunday, 6=Saturday)')
    .max(6, 'Day of week must be between 0 and 6 (0=Sunday, 6=Saturday)'),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format (24-hour)'),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format (24-hour)'),
  isAvailable: z.boolean().optional().default(true),
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
 * Update availability schema
 * Used when updating availability details
 */
export const updateAvailabilitySchema = z.object({
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format (24-hour)')
    .optional(),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format (24-hour)')
    .optional(),
  isAvailable: z.boolean().optional(),
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
 * Bulk update availability schema
 * Used when updating multiple days at once
 */
export const bulkUpdateAvailabilitySchema = z.object({
  availabilities: z
    .array(createAvailabilitySchema)
    .min(1, 'At least one availability is required')
    .max(7, 'Cannot update more than 7 days at once'),
});

/**
 * Query availability schema
 * Used for filtering
 */
export const queryAvailabilitySchema = z.object({
  photographer: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photographer ID format')
    .optional(),
  dayOfWeek: z
    .string()
    .regex(/^[0-6]$/)
    .transform(Number)
    .pipe(z.number().min(0).max(6))
    .optional(),
  isAvailable: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
});

/**
 * Type exports
 */
export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
export type BulkUpdateAvailabilityInput = z.infer<typeof bulkUpdateAvailabilitySchema>;
export type QueryAvailabilityInput = z.infer<typeof queryAvailabilitySchema>;

