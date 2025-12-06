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
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  DECLINED = 'declined',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
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
  BANK_ACCOUNT = 'bank_account',
}

export enum NotificationType {
  BOOKING_REQUEST = 'booking_request',
  BOOKING_ACCEPTED = 'booking_accepted',
  BOOKING_DECLINED = 'booking_declined',
  BOOKING_CANCELLED = 'booking_cancelled',
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

