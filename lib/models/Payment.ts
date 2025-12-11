/**
 * Payment Model
 * Payment transaction tracking (one-to-one with booking)
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import { PaymentStatus, PaymentMethodType } from '@/lib/constants/enums';

// TypeScript interface for Payment
export interface IPayment extends mongoose.Document {
  _id: Types.ObjectId;
  booking: Types.ObjectId; // Reference to Booking (required, unique)
  amount: number; // Payment amount (required, min: 0)
  commission: number; // Platform commission (required, min: 0)
  paymentMethod: PaymentMethodType; // Payment method enum (required)
  paymentStatus: PaymentStatus; // Payment status enum (required, default: pending)
  stripePaymentId?: string; // Stripe payment ID (unique)
  paidAt?: Date; // Payment timestamp
  refundedAt?: Date; // Refund timestamp
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const PaymentSchema = new Schema<IPayment>(
  {
    // Reference to Booking (one-to-one)
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Payment must be associated with a booking'],
      unique: true, // One payment per booking
    },
    
    // Payment amount
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    
    // Platform commission
    commission: {
      type: Number,
      required: [true, 'Commission amount is required'],
      min: [0, 'Commission cannot be negative'],
    },
    
    // Payment method
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethodType),
      required: [true, 'Payment method is required'],
    },
    
    // Payment status
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: [true, 'Payment status is required'],
      default: PaymentStatus.PENDING,
    },
    
    // Stripe payment ID
    stripePaymentId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but enforce uniqueness when present
      trim: true,
    },
    
    // Payment timestamp
    paidAt: {
      type: Date,
    },
    
    // Refund timestamp
    refundedAt: {
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
PaymentSchema.index({ booking: 1 }); // For booking lookups
PaymentSchema.index({ paymentStatus: 1 }); // For status filtering
PaymentSchema.index({ stripePaymentId: 1 }); // For Stripe lookups

// Create the model
// Prevent re-compilation during hot reload in development
const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;


