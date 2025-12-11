/**
 * Application-wide enums and constants
 */

export enum UserRole {
  CUSTOMER = 'customer',
  PHOTOGRAPHER = 'photographer',
  ADMIN = 'admin',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  DECLINED = 'declined', // Keep for backward compatibility
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  PAID = 'paid', // Keep for backward compatibility
}

export enum TransactionType {
  CHARGE = 'charge',
  REFUND = 'refund',
  PAYOUT = 'payout',
  COMMISSION = 'commission',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  BANK_ACCOUNT = 'bank_account',
}

export enum NotificationType {
  BOOKING_REQUEST = 'booking_request',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  MESSAGE_RECEIVED = 'message_received',
  PAYMENT_RECEIVED = 'payment_received',
  REVIEW_RECEIVED = 'review_received',
  MEDIA_UPLOADED = 'media_uploaded',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  // Legacy values for backward compatibility
  BOOKING_ACCEPTED = 'booking_accepted',
  BOOKING_DECLINED = 'booking_declined',
  BOOKING_COMPLETED = 'booking_completed',
  MESSAGE = 'message',
  REVIEW = 'review',
  PAYMENT = 'payment',
  SYSTEM = 'system',
}

export enum AdminActionType {
  USER_SUSPENDED = 'user_suspended',
  USER_ACTIVATED = 'user_activated',
  USER_DELETED = 'user_deleted',
  BOOKING_REFUNDED = 'booking_refunded',
  PAYMENT_PROCESSED = 'payment_processed',
  SYSTEM_CONFIG_UPDATED = 'system_config_updated',
}

export enum EntityType {
  USER = 'user',
  BOOKING = 'booking',
  PAYMENT = 'payment',
  SYSTEM = 'system',
}

export enum AttachmentType {
  IMAGE = 'image',
  FILE = 'file',
  LINK = 'link',
}

// Default values
export const DEFAULT_COMMISSION_PERCENTAGE = 9;
export const DEFAULT_COMMISSION_FIXED = 2;
export const DEFAULT_CURRENCY = 'CAD';
export const DEFAULT_TIMEZONE = 'America/Montreal';
export const DEFAULT_PROVINCE = 'Quebec';
export const DEFAULT_COUNTRY = 'Canada';

