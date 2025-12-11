/**
 * Refund Model
 * Refund processing with tiered policy
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// Refund policy tiers enum
export enum RefundPolicyTier {
  FULL_REFUND = 'full_refund', // 100% refund (>7 days before booking)
  PARTIAL_REFUND_75 = 'partial_refund_75', // 75% refund (4-7 days before booking)
  PARTIAL_REFUND_50 = 'partial_refund_50', // 50% refund (2-3 days before booking)
  NO_REFUND = 'no_refund', // 0% refund (<2 days before booking)
}

// Refund status enum
export enum RefundStatus {
  PENDING = 'pending', // Refund requested, awaiting approval
  APPROVED = 'approved', // Refund approved by admin
  PROCESSING = 'processing', // Refund being processed
  COMPLETED = 'completed', // Refund successfully issued
  REJECTED = 'rejected', // Refund request rejected
}

// TypeScript interface for Refund
export interface IRefund extends mongoose.Document {
  _id: Types.ObjectId;
  payment: Types.ObjectId; // Reference to Payment (required)
  booking: Types.ObjectId; // Reference to Booking (required)
  refundAmount: number; // Refund amount (required, min: 0)
  refundPercentage: number; // Refund percentage (required, 0-100)
  refundPolicyTier: RefundPolicyTier; // Refund policy tier enum (required)
  reason: string; // Refund reason (required)
  status: RefundStatus; // Refund status enum (required, default: pending)
  processedAt?: Date; // Processing timestamp
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const RefundSchema = new Schema<IRefund>(
  {
    // Reference to Payment
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: [true, 'Refund must be associated with a payment'],
    },
    
    // Reference to Booking
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Refund must be associated with a booking'],
    },
    
    // Refund amount
    refundAmount: {
      type: Number,
      required: [true, 'Refund amount is required'],
      min: [0, 'Refund amount cannot be negative'],
    },
    
    // Refund percentage (0-100)
    refundPercentage: {
      type: Number,
      required: [true, 'Refund percentage is required'],
      min: [0, 'Refund percentage cannot be negative'],
      max: [100, 'Refund percentage cannot exceed 100'],
    },
    
    // Refund policy tier
    refundPolicyTier: {
      type: String,
      enum: Object.values(RefundPolicyTier),
      required: [true, 'Refund policy tier is required'],
    },
    
    // Refund reason
    reason: {
      type: String,
      required: [true, 'Refund reason is required'],
      trim: true,
    },
    
    // Refund status
    status: {
      type: String,
      enum: Object.values(RefundStatus),
      required: [true, 'Refund status is required'],
      default: RefundStatus.PENDING,
    },
    
    // Processing timestamp
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
RefundSchema.index({ payment: 1 }); // For payment lookups
RefundSchema.index({ booking: 1 }); // For booking lookups
RefundSchema.index({ status: 1 }); // For status filtering

// Create the model
// Prevent re-compilation during hot reload in development
const Refund: Model<IRefund> =
  mongoose.models.Refund || mongoose.model<IRefund>('Refund', RefundSchema);

export default Refund;


