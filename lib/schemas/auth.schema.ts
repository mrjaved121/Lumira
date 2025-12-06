/**
 * Zod validation schemas for authentication
 */

import { z } from 'zod';
import { UserRole } from '@/lib/constants/enums';

/**
 * Registration schema
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  role: z
    .enum([UserRole.CUSTOMER, UserRole.PHOTOGRAPHER], {
      errorMap: () => ({ message: 'Role must be either customer or photographer' }),
    })
    .default(UserRole.CUSTOMER),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[\d\s-()]+$/.test(val),
      'Please provide a valid phone number'
    ),
});

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Type exports
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

