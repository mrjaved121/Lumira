/**
 * Zod validation schemas for user management
 */

import { z } from 'zod';

/**
 * Update user profile schema
 */
export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .optional(),
  firstName: z
    .string()
    .min(1, 'First name must be at least 1 character')
    .max(100, 'First name cannot exceed 100 characters')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name must be at least 1 character')
    .max(100, 'Last name cannot exceed 100 characters')
    .optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s-()]+$/.test(val),
      'Please provide a valid phone number'
    ),
  location: z
    .object({
      city: z.string().max(100, 'City cannot exceed 100 characters').optional(),
      province: z
        .string()
        .max(100, 'Province cannot exceed 100 characters')
        .optional(),
      country: z
        .string()
        .max(100, 'Country cannot exceed 100 characters')
        .optional(),
    })
    .optional(),
});

/**
 * Change password schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

/**
 * Update user settings schema
 */
export const updateUserSettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  messageNotifications: z.boolean().optional(),
  promotionalEmails: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  publicProfile: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  showBookingHistory: z.boolean().optional(),
});

/**
 * Update email verification status schema
 * Used by system/admin to verify user email
 */
export const updateEmailVerificationSchema = z.object({
  emailVerified: z.boolean(),
});

/**
 * Type exports
 */
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>;
export type UpdateEmailVerificationInput = z.infer<typeof updateEmailVerificationSchema>;

