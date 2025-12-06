/**
 * TypeScript type definitions for database models
 */

import { Document, Types } from 'mongoose';
import {
  UserRole,
  BookingStatus,
  PaymentStatus,
  TransactionType,
  TransactionStatus,
  PayoutStatus,
  MessageStatus,
  PaymentMethodType,
  NotificationType,
  AdminActionType,
  EntityType,
  AttachmentType,
} from '@/lib/constants/enums';

// Location interface
export interface ILocation {
  city?: string;
  province?: string;
  country?: string;
  address?: string;
}

// Payment Method interface
export interface IPaymentMethod {
  type: PaymentMethodType;
  stripePaymentMethodId?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardBrand?: string;
  isDefault?: boolean;
  isVerified?: boolean;
}

// User Settings interface
export interface IUserSettings {
  emailNotifications?: boolean;
  messageNotifications?: boolean;
  promotionalEmails?: boolean;
  pushNotifications?: boolean;
  publicProfile?: boolean;
  showLocation?: boolean;
  showBookingHistory?: boolean;
}

// Base User interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  googleId?: string;
  phone?: string;
  role: UserRole;
  specialties?: string[];
  profilePicture?: string;
  avatar?: string;
  location?: ILocation;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  isActive: boolean;
  paymentMethods?: IPaymentMethod[];
  settings?: IUserSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Export other interfaces as needed
export type { IUser as IPhotographer, IUser as IBooking, IUser as IPhoto };

