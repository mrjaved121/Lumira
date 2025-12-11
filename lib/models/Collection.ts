/**
 * Collection Model
 * User-created photo collections
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for Collection
export interface ICollection extends mongoose.Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; // Reference to User (required)
  name: string; // Collection name (required, max 100 chars)
  description?: string; // Description (max 500 chars)
  photos?: Types.ObjectId[]; // Array of Photo references
  coverPhoto?: Types.ObjectId; // Reference to Photo (cover)
  isPublic: boolean; // Public visibility (default: false)
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  photoCount?: number;
}

// Create the schema
const CollectionSchema = new Schema<ICollection>(
  {
    // Reference to User
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Collection must be associated with a user'],
    },
    
    // Collection name
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      maxlength: [100, 'Collection name cannot be more than 100 characters'],
      trim: true,
    },
    
    // Description
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
      trim: true,
    },
    
    // Array of Photo references
    photos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Photo',
      },
    ],
    
    // Reference to Photo (cover)
    coverPhoto: {
      type: Schema.Types.ObjectId,
      ref: 'Photo',
    },
    
    // Public visibility
    isPublic: {
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
CollectionSchema.index({ user: 1, createdAt: -1 }); // Descending for user's collections
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

// Virtual field: photoCount
CollectionSchema.virtual('photoCount').get(function () {
  return this.photos?.length || 0;
});

// Create the model
// Prevent re-compilation during hot reload in development
const Collection: Model<ICollection> =
  mongoose.models.Collection ||
  mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection;

