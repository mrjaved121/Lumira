/**
 * Photographer Model
 * Extended profile data for photographer users
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import { DEFAULT_PROVINCE } from '@/lib/constants/enums';

// TypeScript interface for Photographer
export interface IPhotographer extends mongoose.Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; // Reference to User (required, unique)
  businessName?: string; // Business name (max 255 chars)
  bio?: string; // Biography (TEXT)
  yearsExperience?: number; // Years of experience (INTEGER)
  hourlyRate?: number; // Hourly rate (DECIMAL(10,2), min: 0)
  locationCity: string; // Location city (required, max 100 chars)
  locationRegion: string; // Location region (required, max 100 chars, Quebec only)
  portfolioUrl?: string; // Portfolio URL (TEXT)
  instagramHandle?: string; // Instagram handle (max 100 chars)
  isVerified: boolean; // Verification status (default: false)
  averageRating: number; // Average rating (0-5, default: 0.00)
  totalBookings: number; // Total bookings count (default: 0)
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const PhotographerSchema = new Schema<IPhotographer>(
  {
    // Reference to User - one-to-one relationship
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Photographer must be associated with a user'],
      unique: true, // One photographer profile per user
    },
    
    // Business name
    businessName: {
      type: String,
      maxlength: [255, 'Business name cannot exceed 255 characters'],
      trim: true,
    },
    
    // Biography
    bio: {
        type: String,
        trim: true,
      },
    
    // Years of experience
    yearsExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
    },
    
    // Hourly rate
    hourlyRate: {
      type: Number,
      min: [0, 'Hourly rate cannot be negative'],
      },
    
    // Location city (required)
    locationCity: {
        type: String,
      required: [true, 'Location city is required'],
      maxlength: [100, 'City cannot exceed 100 characters'],
        trim: true,
      },
    
    // Location region (required, Quebec only)
    locationRegion: {
      type: String,
      required: [true, 'Location region is required'],
      maxlength: [100, 'Region cannot exceed 100 characters'],
      default: DEFAULT_PROVINCE,
      trim: true,
      validate: {
        validator: function(v: string) {
          // Ensure it's Quebec-based
          return v.toLowerCase().includes('quebec') || v.toLowerCase() === 'qc';
        },
        message: 'Location region must be Quebec-based',
      },
    },
    
    // Portfolio URL
    portfolioUrl: {
      type: String,
      trim: true,
    },
    
    // Instagram handle
    instagramHandle: {
      type: String,
      maxlength: [100, 'Instagram handle cannot exceed 100 characters'],
      trim: true,
    },
    
    // Verification status
    isVerified: {
      type: Boolean,
      required: [true, 'Verification status is required'],
      default: false,
    },
    
    // Average rating (0-5, stored as decimal)
    averageRating: {
      type: Number,
      required: [true, 'Average rating is required'],
      default: 0.0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    
    // Total bookings count
    totalBookings: {
      type: Number,
      required: [true, 'Total bookings is required'],
      default: 0,
      min: [0, 'Total bookings cannot be negative'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
PhotographerSchema.index({ user: 1 }, { unique: true });
PhotographerSchema.index({ locationCity: 1, locationRegion: 1 }); // For location search
PhotographerSchema.index({ isVerified: 1 }); // For verified photographers
PhotographerSchema.index({ averageRating: -1 }); // Descending for sorting by rating
PhotographerSchema.index({ createdAt: -1 }); // Descending for sorting by newest

// Text index for search functionality
PhotographerSchema.index(
  {
    businessName: 'text',
    bio: 'text',
    locationCity: 'text',
    locationRegion: 'text',
  },
  {
    name: 'photographer_text_index',
  }
);

// Create the model
// Prevent re-compilation during hot reload in development
const Photographer: Model<IPhotographer> =
  mongoose.models.Photographer ||
  mongoose.model<IPhotographer>('Photographer', PhotographerSchema);

export default Photographer;
