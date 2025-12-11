/**
 * Earning Model
 * Photographer earnings from completed bookings
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import { PayoutStatus } from '@/lib/constants/enums';

// TypeScript interface for Earning
export interface IEarning extends mongoose.Document {
  _id: Types.ObjectId;
  photographer: Types.ObjectId; // Reference to Photographer (required)
  booking: Types.ObjectId; // Reference to Booking (required, unique)
  month: number; // Month (1-12, required)
  year: number; // Year (required)
  totalAmount: number; // Total booking amount (required, min: 0)
  commission: number; // Platform commission (required, min: 0)
  earnings: number; // Photographer earnings (required, min: 0)
  payoutStatus: PayoutStatus; // Payout status enum (required)
  payoutDate?: Date; // Payout date
  payoutId?: string; // Payout transaction ID
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const EarningSchema = new Schema<IEarning>(
  {
    // Reference to Photographer
    photographer: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: [true, 'Earning must be associated with a photographer'],
    },
    
    // Reference to Booking (unique - one earning per booking)
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Earning must be associated with a booking'],
      unique: true,
    },
    
    // Month (1-12)
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    
    // Year
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be a valid year'],
    },
    
    // Total booking amount
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    
    // Platform commission
    commission: {
      type: Number,
      required: [true, 'Commission is required'],
      min: [0, 'Commission cannot be negative'],
    },
    
    // Photographer earnings
    earnings: {
      type: Number,
      required: [true, 'Earnings is required'],
      min: [0, 'Earnings cannot be negative'],
    },
    
    // Payout status
    payoutStatus: {
      type: String,
      enum: Object.values(PayoutStatus),
      required: [true, 'Payout status is required'],
    },
    
    // Payout date
    payoutDate: {
      type: Date,
    },
    
    // Payout transaction ID
    payoutId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
EarningSchema.index(
  { photographer: 1, year: -1, month: -1 },
  { unique: false }
); // Descending for photographer's earnings by year/month
EarningSchema.index({ booking: 1 }, { unique: true }); // One earning per booking
EarningSchema.index({ payoutStatus: 1 }); // For filtering by payout status

// Create the model
// Prevent re-compilation during hot reload in development
const Earning: Model<IEarning> =
  mongoose.models.Earning || mongoose.model<IEarning>('Earning', EarningSchema);

export default Earning;

