/**
 * PhotographyType Model
 * Master list of 28 professional photography categories
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for PhotographyType
export interface IPhotographyType extends mongoose.Document {
  _id: Types.ObjectId;
  name: string; // Photography type name (required, unique, max 100 chars)
  description?: string; // Description (TEXT)
  icon?: string; // Icon identifier (max 50 chars)
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const PhotographyTypeSchema = new Schema<IPhotographyType>(
  {
    // Photography type name
    name: {
      type: String,
      required: [true, 'Photography type name is required'],
      unique: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
      trim: true,
    },
    
    // Description
    description: {
      type: String,
      trim: true,
    },
    
    // Icon identifier
    icon: {
      type: String,
      maxlength: [50, 'Icon cannot exceed 50 characters'],
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
PhotographyTypeSchema.index({ name: 1 }); // For name lookups

// Create the model
// Prevent re-compilation during hot reload in development
const PhotographyType: Model<IPhotographyType> =
  mongoose.models.PhotographyType ||
  mongoose.model<IPhotographyType>('PhotographyType', PhotographyTypeSchema);

export default PhotographyType;

