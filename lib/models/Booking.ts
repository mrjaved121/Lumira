/**
 * Booking Model
 * Core booking lifecycle management
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import { BookingStatus } from '@/lib/constants/enums';
import { DEFAULT_COMMISSION_PERCENTAGE, DEFAULT_COMMISSION_FIXED } from '@/lib/constants/enums';

// TypeScript interface for Booking
export interface IBooking extends mongoose.Document {
  _id: Types.ObjectId;
  client: Types.ObjectId; // Reference to User (customer, required)
  photographer: Types.ObjectId; // Reference to Photographer (required)
  photographyType: Types.ObjectId; // Reference to PhotographyType (required)
  status: BookingStatus; // Status enum (required, default: pending)
  bookingDate: Date; // Booking date (required)
  startTime: string; // Start time (required, TIME format)
  endTime: string; // End time (required, TIME format)
  locationAddress: string; // Location address (required, TEXT)
  locationCity: string; // Location city (required, max 100 chars)
  totalAmount: number; // Total booking amount (required, min: 0)
  commissionAmount: number; // Platform commission (required, min: 0)
  photographerPayout: number; // Photographer payout (required, min: 0)
  specialRequests?: string; // Special requests (TEXT)
  cancellationReason?: string; // Cancellation reason (TEXT)
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const BookingSchema = new Schema<IBooking>(
  {
    // Reference to User (customer/client)
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must have a client'],
    },
    
    // Reference to Photographer
    photographer: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: [true, 'Booking must have a photographer'],
    },
    
    // Reference to PhotographyType
    photographyType: {
      type: Schema.Types.ObjectId,
      ref: 'PhotographyType',
      required: [true, 'Booking must have a photography type'],
    },
    
    // Booking status
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      required: [true, 'Booking status is required'],
      default: BookingStatus.PENDING,
    },
    
    // Booking date
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    
    // Start time (HH:MM format)
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'],
    },
    
    // End time (HH:MM format)
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'],
    },
    
    // Location address
    locationAddress: {
      type: String,
      required: [true, 'Location address is required'],
      trim: true,
    },
    
    // Location city
    locationCity: {
      type: String,
      required: [true, 'Location city is required'],
      maxlength: [100, 'City cannot exceed 100 characters'],
      trim: true,
    },
    
    // Total booking amount
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    
    // Platform commission
    commissionAmount: {
      type: Number,
      required: [true, 'Commission amount is required'],
      min: [0, 'Commission cannot be negative'],
    },
    
    // Photographer payout
    photographerPayout: {
      type: Number,
      required: [true, 'Photographer payout is required'],
      min: [0, 'Photographer payout cannot be negative'],
    },
    
    // Special requests
    specialRequests: {
      type: String,
      trim: true,
    },
    
    // Cancellation reason
    cancellationReason: {
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
BookingSchema.index({ client: 1 }); // For client lookups
BookingSchema.index({ photographer: 1 }); // For photographer lookups
BookingSchema.index({ status: 1 }); // For status filtering
BookingSchema.index({ bookingDate: 1 }); // For date queries
BookingSchema.index({ createdAt: -1 }); // Descending for date sorting

// Pre-save hook: Auto-calculate commission and payout
BookingSchema.pre('save', function (next) {
  // Only calculate if totalAmount has changed or it's a new document
  if (this.isNew || this.isModified('totalAmount')) {
    // Calculate commission: (totalAmount * 9%) + $2
    const commissionPercentage = DEFAULT_COMMISSION_PERCENTAGE;
    const commissionFixed = DEFAULT_COMMISSION_FIXED;
    
    this.commissionAmount = (this.totalAmount * commissionPercentage / 100) + commissionFixed;
    
    // Calculate photographer payout: totalAmount - commissionAmount
    this.photographerPayout = this.totalAmount - this.commissionAmount;
  }
  
  // Validate end time is after start time
  if (this.startTime && this.endTime) {
    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) {
      return next(new Error('End time must be after start time'));
    }
  }
  
  next();
});

// Create the model
// Prevent re-compilation during hot reload in development
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
