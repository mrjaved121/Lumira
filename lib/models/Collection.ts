/**
 * Collection Model
 * Client-created photo collections/albums
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for Collection
export interface ICollection extends mongoose.Document {
  _id: Types.ObjectId;
  client: Types.ObjectId; // Reference to User (client, required)
  name: string; // Collection name (required, max 255 chars)
  description?: string; // Description (TEXT)
  coverPhoto?: string; // Cover photo URL (TEXT)
  isPublic: boolean; // Public visibility (required, default: false)
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const CollectionSchema = new Schema<ICollection>(
  {
    // Reference to User (client)
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Collection must be associated with a client'],
    },
    
    // Collection name
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      maxlength: [255, 'Collection name cannot exceed 255 characters'],
      trim: true,
    },
    
    // Description
    description: {
      type: String,
      trim: true,
    },
    
    // Cover photo URL (TEXT)
    coverPhoto: {
      type: String,
      trim: true,
    },
    
    // Public visibility
    isPublic: {
      type: Boolean,
      required: [true, 'Public visibility status is required'],
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
CollectionSchema.index({ client: 1, createdAt: -1 }); // Descending for client's collections
CollectionSchema.index({ isPublic: 1 }); // For public collections
CollectionSchema.index({ createdAt: -1 }); // For date sorting

// Text index for search functionality
CollectionSchema.index(
  {
    name: 'text',
    description: 'text',
  },
  {
    name: 'collection_text_index',
  }
);

// Create the model
// Prevent re-compilation during hot reload in development
const Collection: Model<ICollection> =
  mongoose.models.Collection ||
  mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection;
