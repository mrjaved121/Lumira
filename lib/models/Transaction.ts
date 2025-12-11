/**
 * Transaction Model
 * Financial transactions (payments, refunds, payouts)
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import { TransactionType, TransactionStatus } from '@/lib/constants/enums';
import { DEFAULT_CURRENCY } from '@/lib/constants/enums';

// TypeScript interface for Transaction
export interface ITransaction extends mongoose.Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; // Reference to User (required)
  type: TransactionType; // Transaction type enum (required)
  amount: number; // Transaction amount (required)
  currency: string; // Currency (default: CAD)
  status: TransactionStatus; // Transaction status enum (required)
  description: string; // Transaction description (required)
  booking?: Types.ObjectId; // Reference to Booking (optional)
  paymentMethod?: string; // Payment method
  transactionId?: string; // External transaction ID (e.g., Stripe)
  metadata?: Map<string, any>; // Additional metadata
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const TransactionSchema = new Schema<ITransaction>(
  {
    // Reference to User
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Transaction must be associated with a user'],
    },
    
    // Transaction type
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: [true, 'Transaction type is required'],
    },
    
    // Transaction amount
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required'],
    },
    
    // Currency
    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
    },
    
    // Transaction status
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: [true, 'Transaction status is required'],
    },
    
    // Transaction description
    description: {
      type: String,
      required: [true, 'Transaction description is required'],
      trim: true,
    },
    
    // Reference to Booking (optional)
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    
    // Payment method
    paymentMethod: {
      type: String,
      trim: true,
    },
    
    // External transaction ID (e.g., Stripe)
    transactionId: {
      type: String,
      trim: true,
    },
    
    // Additional metadata
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
TransactionSchema.index({ user: 1, createdAt: -1 }); // Descending for user's transactions
TransactionSchema.index({ type: 1, status: 1 }); // For filtering by type and status
TransactionSchema.index({ transactionId: 1 }); // For external transaction lookups

// Create the model
// Prevent re-compilation during hot reload in development
const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;

