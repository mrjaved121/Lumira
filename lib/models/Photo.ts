/**
 * Photo Model
 * Photo/image uploaded by photographers
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for Photo
export interface IPhoto extends mongoose.Document {
  _id: Types.ObjectId;
  photographer: Types.ObjectId; // Reference to Photographer (required)
  title?: string; // Photo title (max 200 chars)
  description?: string; // Description (max 1000 chars)
  imageUrl: string; // Image URL (required)
  thumbnailUrl?: string; // Thumbnail URL
  category?: string; // Category
  tags?: string[]; // Tags array
  location?: {
    city?: string;
    province?: string;
  };
  equipment?: {
    camera?: string; // Camera model
    lens?: string; // Lens model
    settings?: string; // Camera settings
  };
  favorites?: Types.ObjectId[]; // Array of User references (users who favorited)
  likes: number; // Like count (default: 0)
  views: number; // View count (default: 0)
  isPortfolio: boolean; // Portfolio photo flag (default: true)
  isPublic: boolean; // Public visibility (default: true)
  collection?: Types.ObjectId; // Reference to Collection
  booking?: Types.ObjectId; // Reference to Booking (if from booking)
  metadata?: {
    width?: number; // Image width
    height?: number; // Image height
    fileSize?: number; // File size in bytes
    format?: string; // File format (jpeg, png, raw, etc.)
    uploadedAt?: Date; // Upload timestamp
  };
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  favoriteCount?: number;
}

// Create the schema
const PhotoSchema = new Schema<IPhoto>(
  {
    // Reference to Photographer
    photographer: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: [true, 'Photo must be associated with a photographer'],
    },
    
    // Photo title
    title: {
      type: String,
      maxlength: [200, 'Title cannot be more than 200 characters'],
      trim: true,
    },
    
    // Photo description
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
      trim: true,
    },
    
    // Image URL - required
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    
    // Thumbnail URL
    thumbnailUrl: {
      type: String,
    },
    
    // Category
    category: {
      type: String,
      trim: true,
    },
    
    // Tags array
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    
    // Location
    location: {
      city: {
        type: String,
        trim: true,
      },
      province: {
        type: String,
        trim: true,
      },
    },
    
    // Equipment details
    equipment: {
      camera: {
        type: String,
        trim: true,
      },
      lens: {
        type: String,
        trim: true,
      },
      settings: {
        type: String,
        trim: true,
      },
    },
    
    // Favorites - array of User references
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    
    // Like count
    likes: {
      type: Number,
      default: 0,
      min: [0, 'Likes cannot be negative'],
    },
    
    // View count
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative'],
    },
    
    // Portfolio photo flag
    isPortfolio: {
      type: Boolean,
      default: true,
    },
    
    // Public visibility
    isPublic: {
      type: Boolean,
      default: true,
    },
    
    // Reference to Collection
    collection: {
      type: Schema.Types.ObjectId,
      ref: 'Collection',
    },
    
    // Reference to Booking (if from booking)
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    
    // Image metadata
    metadata: {
      width: {
        type: Number,
        min: [0, 'Width cannot be negative'],
      },
      height: {
        type: Number,
        min: [0, 'Height cannot be negative'],
      },
      fileSize: {
        type: Number,
        min: [0, 'File size cannot be negative'],
      },
      format: {
        type: String,
        trim: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
PhotoSchema.index({ photographer: 1, createdAt: -1 }); // Descending for photographer's photos
PhotoSchema.index({ isPublic: 1, createdAt: -1 }); // Descending for public photos
PhotoSchema.index({ category: 1 });
PhotoSchema.index({ tags: 1 });
PhotoSchema.index({ 'location.city': 1, 'location.province': 1 });

// Virtual field: favoriteCount
PhotoSchema.virtual('favoriteCount').get(function () {
  return this.favorites?.length || 0;
});

// Create the model
// Prevent re-compilation during hot reload in development
const Photo: Model<IPhoto> =
  mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);

export default Photo;

