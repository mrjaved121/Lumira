/**
 * Media Model
 * Photos and videos from bookings and portfolios
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// Media type enum
export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
}

// TypeScript interface for Media
export interface IMedia extends mongoose.Document {
  _id: Types.ObjectId;
  booking?: Types.ObjectId; // Reference to Booking (optional)
  photographer: Types.ObjectId; // Reference to Photographer (required)
  url: string; // Media URL (required)
  thumbnailUrl?: string; // Thumbnail URL (optional)
  type: MediaType; // Media type enum (required)
  title?: string; // Media title (max 255 chars)
  description?: string; // Description (TEXT)
  isPortfolio: boolean; // Portfolio flag (required, default: false)
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const MediaSchema = new Schema<IMedia>(
  {
    // Reference to Booking (optional)
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    
    // Reference to Photographer
    photographer: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: [true, 'Media must be associated with a photographer'],
    },
    
    // Media URL
    url: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    
    // Thumbnail URL
    thumbnailUrl: {
      type: String,
    },
    
    // Media type
    type: {
      type: String,
      enum: Object.values(MediaType),
      required: [true, 'Media type is required'],
    },
    
    // Media title
    title: {
      type: String,
      maxlength: [255, 'Title cannot exceed 255 characters'],
      trim: true,
    },
    
    // Description
    description: {
      type: String,
      trim: true,
    },
    
    // Portfolio flag
    isPortfolio: {
      type: Boolean,
      required: [true, 'Portfolio flag is required'],
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
MediaSchema.index({ booking: 1 }); // For booking lookups
MediaSchema.index({ photographer: 1 }); // For photographer lookups
MediaSchema.index({ photographer: 1, isPortfolio: 1 }); // For portfolio queries
MediaSchema.index({ createdAt: -1 }); // For date sorting

// Create the model
// Prevent re-compilation during hot reload in development
const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;


