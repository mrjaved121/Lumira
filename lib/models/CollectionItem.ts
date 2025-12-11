/**
 * CollectionItem Model
 * Junction table linking media to collections
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for CollectionItem
export interface ICollectionItem extends mongoose.Document {
  _id: Types.ObjectId;
  collectionId: Types.ObjectId; // Reference to Collection model (required)
  media: Types.ObjectId; // Reference to Media (required)
  order: number; // Display order (required, default: 0)
  addedAt: Date; // When item was added (default: now)
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const CollectionItemSchema = new Schema<ICollectionItem>(
  {
    // Reference to Collection model
    collectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Collection',
      required: [true, 'Collection item must be associated with a collection'],
    },
    
    // Reference to Media
    media: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
      required: [true, 'Collection item must be associated with media'],
    },
    
    // Display order
    order: {
      type: Number,
      required: [true, 'Order is required'],
      default: 0,
      min: [0, 'Order cannot be negative'],
    },
    
    // When item was added
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
CollectionItemSchema.index({ collectionId: 1 }); // For collection lookups
CollectionItemSchema.index({ media: 1 }); // For media lookups
CollectionItemSchema.index({ collectionId: 1, order: 1 }); // For ordered queries
// Unique constraint: one media item can only appear once per collection
CollectionItemSchema.index(
  { collectionId: 1, media: 1 },
  { unique: true }
);

// Create the model
// Prevent re-compilation during hot reload in development
const CollectionItem: Model<ICollectionItem> =
  mongoose.models.CollectionItem ||
  mongoose.model<ICollectionItem>('CollectionItem', CollectionItemSchema);

export default CollectionItem;

