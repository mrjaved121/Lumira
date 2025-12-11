/**
 * Booking Model
 * Booking/appointment between customer and photographer
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import { BookingStatus, PaymentStatus } from '@/lib/constants/enums';
import { DEFAULT_COMMISSION_PERCENTAGE, DEFAULT_COMMISSION_FIXED } from '@/lib/constants/enums';

// TypeScript interface for Booking
export interface IBooking extends mongoose.Document {
  _id: Types.ObjectId;
  client: Types.ObjectId; // Reference to User (customer, required)
  photographer: Types.ObjectId; // Reference to Photographer (required)
  date: Date; // Booking date (required)
  startTime: string; // Start time (required)
  duration: number; // Duration in hours (required, min: 1)
  location: string; // Location address (required)
  notes?: string; // Additional notes (max 500 chars)
  status: BookingStatus; // Status enum (default: pending)
  pricing: {
    basePrice: number; // Base price (required, min: 0)
    hourlyRate?: number; // Hourly rate (min: 0)
    durationHours: number; // Duration in hours (required, min: 1)
    subtotal: number; // Subtotal (calculated)
    commission: number; // Platform commission (calculated)
    commissionPercentage?: number; // Commission % (default: 9)
    commissionFixed?: number; // Fixed commission (default: 2)
    total: number; // Total amount (calculated)
    photographerEarnings: number; // Photographer earnings (calculated)
  };
  payment?: {
    status?: PaymentStatus; // Payment status enum
    paymentMethod?: string; // Payment method
    transactionId?: string; // Transaction ID
    paidAt?: Date; // Payment timestamp
    refundedAt?: Date; // Refund timestamp
    refundAmount?: number; // Refund amount
    refundReason?: string; // Refund reason
  };
  photos?: Types.ObjectId[]; // Array of Photo references
  review?: Types.ObjectId; // Reference to Review (one per booking)
  cancelledBy?: 'client' | 'photographer' | 'admin'; // Who cancelled
  cancellationReason?: string; // Cancellation reason
  cancelledAt?: Date; // Cancellation timestamp
  completedAt?: Date; // Completion timestamp
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
    
    // Booking date
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    
    // Start time
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    
    // Duration in hours
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 hour'],
    },
    
    // Location address
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    
    // Additional notes
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
      trim: true,
    },
    
    // Booking status
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      required: true,
    },
    
    // Pricing breakdown
    pricing: {
      basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Base price cannot be negative'],
      },
      hourlyRate: {
        type: Number,
        min: [0, 'Hourly rate cannot be negative'],
      },
      durationHours: {
        type: Number,
        required: [true, 'Duration hours is required'],
        min: [1, 'Duration hours must be at least 1'],
      },
      subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal cannot be negative'],
      },
      commission: {
        type: Number,
        required: true,
        min: [0, 'Commission cannot be negative'],
      },
      commissionPercentage: {
        type: Number,
        default: DEFAULT_COMMISSION_PERCENTAGE,
      },
      commissionFixed: {
        type: Number,
        default: DEFAULT_COMMISSION_FIXED,
      },
      total: {
        type: Number,
        required: true,
        min: [0, 'Total cannot be negative'],
      },
      photographerEarnings: {
        type: Number,
        required: true,
        min: [0, 'Photographer earnings cannot be negative'],
      },
    },
    
    // Payment details
    payment: {
      status: {
        type: String,
        enum: Object.values(PaymentStatus),
      },
      paymentMethod: {
        type: String,
        trim: true,
      },
      transactionId: {
        type: String,
        trim: true,
      },
      paidAt: {
        type: Date,
      },
      refundedAt: {
        type: Date,
      },
      refundAmount: {
        type: Number,
        min: [0, 'Refund amount cannot be negative'],
      },
      refundReason: {
        type: String,
        trim: true,
      },
    },
    
    // Array of Photo references
    photos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Photo',
      },
    ],
    
    // Reference to Review (one per booking)
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
    
    // Cancellation details
    cancelledBy: {
      type: String,
      enum: ['client', 'photographer', 'admin'],
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    cancelledAt: {
      type: Date,
    },
    
    // Completion timestamp
    completedAt: {
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
BookingSchema.index({ client: 1, createdAt: -1 }); // Descending for client's bookings
BookingSchema.index({ photographer: 1, createdAt: -1 }); // Descending for photographer's bookings
BookingSchema.index({ status: 1, date: 1 }); // For filtering by status and date
BookingSchema.index({ date: 1 }); // For date-based queries
BookingSchema.index({ review: 1 }, { unique: true, sparse: true }); // One review per booking

// Pre-save hook: Auto-calculate pricing
BookingSchema.pre('save', function (next) {
  // Only calculate if pricing fields have changed or it's a new document
  if (this.isNew || this.isModified('pricing.basePrice') || 
      this.isModified('pricing.hourlyRate') || 
      this.isModified('pricing.durationHours') ||
      this.isModified('duration')) {
    
    // Ensure durationHours matches duration
    if (!this.pricing.durationHours) {
      this.pricing.durationHours = this.duration;
    }
    
    // Calculate subtotal: basePrice + (hourlyRate * duration)
    const basePrice = this.pricing.basePrice || 0;
    const hourlyRate = this.pricing.hourlyRate || 0;
    const durationHours = this.pricing.durationHours || this.duration;
    
    this.pricing.subtotal = basePrice + (hourlyRate * durationHours);
    
    // Calculate commission: (subtotal * commissionPercentage%) + commissionFixed
    const commissionPercentage = this.pricing.commissionPercentage || DEFAULT_COMMISSION_PERCENTAGE;
    const commissionFixed = this.pricing.commissionFixed || DEFAULT_COMMISSION_FIXED;
    
    this.pricing.commission = (this.pricing.subtotal * commissionPercentage / 100) + commissionFixed;
    
    // Calculate total: subtotal + commission
    this.pricing.total = this.pricing.subtotal + this.pricing.commission;
    
    // Calculate photographer earnings: subtotal - commission
    this.pricing.photographerEarnings = this.pricing.subtotal - this.pricing.commission;
  }
  
  next();
});

// Create the model
// Prevent re-compilation during hot reload in development
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;



