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
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Photographer interface
export interface IPhotographer extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  bio?: string;
  location?: {
    city?: string;
    province?: string;
    address?: string;
  };
  specialties: string[];
  portfolio?: Types.ObjectId[];
  coverPhoto?: string;
  profilePhoto?: string;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  totalEarnings: number;
  followers?: Types.ObjectId[];
  following?: Types.ObjectId[];
  availability?: {
    workingHours?: {
      [key: string]: {
        start?: string;
        end?: string;
        available?: boolean;
      };
    };
    blockedDates?: Array<{
      date: Date;
      reason?: string;
    }>;
    timeZone?: string;
  };
  pricing?: {
    basePrice?: number;
    hourlyRate?: number;
    packages?: Array<{
      name?: string;
      duration?: number;
      price?: number;
      description?: string;
    }>;
    currency?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  followerCount?: number;
}

// Photo interface
export interface IPhoto extends Document {
  _id: Types.ObjectId;
  photographer: Types.ObjectId;
  title?: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  location?: {
    city?: string;
    province?: string;
  };
  equipment?: {
    camera?: string;
    lens?: string;
    settings?: string;
  };
  favorites?: Types.ObjectId[];
  likes: number;
  views: number;
  isPortfolio: boolean;
  isPublic: boolean;
  collection?: Types.ObjectId;
  booking?: Types.ObjectId;
  metadata?: {
    width?: number;
    height?: number;
    fileSize?: number;
    format?: string;
    uploadedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  favoriteCount?: number;
}

// Booking interface
export interface IBooking extends Document {
  _id: Types.ObjectId;
  client: Types.ObjectId;
  photographer: Types.ObjectId;
  date: Date;
  startTime: string;
  duration: number;
  location: string;
  notes?: string;
  status: BookingStatus;
  pricing: {
    basePrice: number;
    hourlyRate?: number;
    durationHours: number;
    subtotal: number;
    commission: number;
    commissionPercentage?: number;
    commissionFixed?: number;
    total: number;
    photographerEarnings: number;
  };
  payment?: {
    status?: PaymentStatus;
    paymentMethod?: string;
    transactionId?: string;
    paidAt?: Date;
    refundedAt?: Date;
    refundAmount?: number;
    refundReason?: string;
  };
  photos?: Types.ObjectId[];
  review?: Types.ObjectId;
  cancelledBy?: 'client' | 'photographer' | 'admin';
  cancellationReason?: string;
  cancelledAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Review interface
export interface IReview extends Document {
  _id: Types.ObjectId;
  booking: Types.ObjectId;
  photographer: Types.ObjectId;
  customer: Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  categories?: {
    professionalism?: number;
    communication?: number;
    quality?: number;
    punctuality?: number;
  };
  isVerified: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction interface
export interface ITransaction extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  booking?: Types.ObjectId;
  paymentMethod?: string;
  transactionId?: string;
  metadata?: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Earning interface
export interface IEarning extends Document {
  _id: Types.ObjectId;
  photographer: Types.ObjectId;
  booking: Types.ObjectId;
  month: number;
  year: number;
  totalAmount: number;
  commission: number;
  earnings: number;
  payoutStatus: PayoutStatus;
  payoutDate?: Date;
  payoutId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification interface
export interface INotification extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  readAt?: Date;
  metadata?: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Collection interface
export interface ICollection extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  description?: string;
  photos?: Types.ObjectId[];
  coverPhoto?: Types.ObjectId;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  photoCount?: number;
}

// Conversation interface
export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  booking?: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  lastMessageAt: Date;
  unreadCount?: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

// Message interface
export interface IMessage extends Document {
  _id: Types.ObjectId;
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  status: MessageStatus;
  readAt?: Date;
  attachments?: Array<{
    type: AttachmentType;
    url: string;
    filename?: string;
    size?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// AdminLog interface
export interface IAdminLog extends Document {
  _id: Types.ObjectId;
  admin: Types.ObjectId;
  action: AdminActionType;
  entityType: EntityType;
  entityId: Types.ObjectId;
  reason?: string;
  metadata?: Map<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

