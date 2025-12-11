/**
 * Photographer Model
 * Extended profile for photographers with business details
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import { DEFAULT_PROVINCE, DEFAULT_COUNTRY, DEFAULT_CURRENCY, DEFAULT_TIMEZONE } from '@/lib/constants/enums';

// TypeScript interface for Photographer
export interface IPhotographer extends mongoose.Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; // Reference to User (required, unique)
  bio?: string; // Biography (max 1000 chars)
  location?: {
    city?: string;
    province?: string;
    address?: string;
  };
  specialties: string[]; // Photography specialties (required, min 1)
  portfolio?: Types.ObjectId[]; // Array of Photo references
  coverPhoto?: string; // Cover photo URL
  profilePhoto?: string; // Profile photo URL
  rating: number; // Average rating (0-5, default: 0)
  totalReviews: number; // Total review count (default: 0)
  totalBookings: number; // Total bookings count (default: 0)
  totalEarnings: number; // Total earnings (default: 0)
  followers?: Types.ObjectId[]; // Array of User references (followers)
  following?: Types.ObjectId[]; // Array of User references (following)
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
    basePrice?: number; // Base price (min: 0)
    hourlyRate?: number; // Hourly rate (min: 0)
    packages?: Array<{
      name?: string;
      duration?: number; // Duration in hours
      price?: number; // Package price
      description?: string;
    }>;
    currency?: string; // Currency (default: CAD)
  };
  isVerified: boolean; // Verification status (default: false)
  isActive: boolean; // Active status (default: true)
  featured: boolean; // Featured photographer (default: false)
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  followerCount?: number;
}

// Create the schema
const PhotographerSchema = new Schema<IPhotographer>(
  {
    // Reference to User - this creates the one-to-one relationship
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: [true, 'Photographer must be associated with a user'],
      unique: true, // One photographer profile per user
    },
    
    // Biography - optional text about the photographer
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot be more than 1000 characters'],
      trim: true,
    },
    
    // Location - business location
    location: {
      city: {
        type: String,
        trim: true,
      },
      province: {
        type: String,
        trim: true,
        default: DEFAULT_PROVINCE,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    
    // Specialties - array of photography types (wedding, portrait, etc.)
    specialties: {
      type: [String],
      required: [true, 'At least one specialty is required'],
      validate: {
        validator: function(v: string[]) {
          return v.length >= 1; // Must have at least 1 specialty
        },
        message: 'At least one specialty is required',
      },
    },
    
    // Portfolio - array of Photo references
    portfolio: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Photo',
      },
    ],
    
    // Cover photo URL
    coverPhoto: {
      type: String,
    },
    
    // Profile photo URL
    profilePhoto: {
      type: String,
    },
    
    // Rating - average rating (0-5)
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    
    // Total reviews count
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Total reviews cannot be negative'],
    },
    
    // Total bookings count
    totalBookings: {
      type: Number,
      default: 0,
      min: [0, 'Total bookings cannot be negative'],
    },
    
    // Total earnings
    totalEarnings: {
      type: Number,
      default: 0,
      min: [0, 'Total earnings cannot be negative'],
    },
    
    // Followers - array of User references
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    
    // Following - array of User references
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    
    // Availability settings
    availability: {
      workingHours: {
        type: Map,
        of: {
          start: String,
          end: String,
          available: {
            type: Boolean,
            default: true,
          },
        },
      },
      blockedDates: [
        {
          date: {
            type: Date,
            required: true,
          },
          reason: {
            type: String,
            trim: true,
          },
        },
      ],
      timeZone: {
        type: String,
        default: DEFAULT_TIMEZONE,
      },
    },
    
    // Pricing structure
    pricing: {
      basePrice: {
        type: Number,
        min: [0, 'Base price cannot be negative'],
      },
      hourlyRate: {
        type: Number,
        min: [0, 'Hourly rate cannot be negative'],
      },
      packages: [
        {
          name: {
            type: String,
            trim: true,
          },
          duration: {
            type: Number,
            min: [0, 'Duration cannot be negative'],
          },
          price: {
            type: Number,
            min: [0, 'Price cannot be negative'],
          },
          description: {
            type: String,
            trim: true,
          },
        },
      ],
      currency: {
        type: String,
        default: DEFAULT_CURRENCY,
      },
    },
    
    // Verification status - whether photographer is verified by admin
    isVerified: {
      type: Boolean,
      default: false,
    },
    
    // Active status - whether photographer profile is active
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Featured status - whether photographer is featured on homepage
    featured: {
      type: Boolean,
      default: false,
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
// Text index for search functionality
PhotographerSchema.index(
  {
    'location.city': 'text',
    'location.province': 'text',
    specialties: 'text',
    bio: 'text',
  },
  {
    name: 'photographer_text_index',
  }
);
PhotographerSchema.index({ rating: -1 }); // Descending for sorting by rating
PhotographerSchema.index({ totalBookings: -1 }); // Descending for sorting by bookings
PhotographerSchema.index({ createdAt: -1 }); // Descending for sorting by newest

// Virtual field: followerCount
PhotographerSchema.virtual('followerCount').get(function () {
  return this.followers?.length || 0;
});

// Create the model
// Prevent re-compilation during hot reload in development
const Photographer: Model<IPhotographer> =
  mongoose.models.Photographer ||
  mongoose.model<IPhotographer>('Photographer', PhotographerSchema);

export default Photographer;

