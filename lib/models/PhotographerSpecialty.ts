/**
 * PhotographerSpecialty Model
 * Junction table linking photographers to photography types
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for PhotographerSpecialty
export interface IPhotographerSpecialty extends mongoose.Document {
  _id: Types.ObjectId;
  photographer: Types.ObjectId; // Reference to Photographer (required)
  photographyType: Types.ObjectId; // Reference to PhotographyType (required)
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const PhotographerSpecialtySchema = new Schema<IPhotographerSpecialty>(
  {
    // Reference to Photographer
    photographer: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: [true, 'Photographer is required'],
    },
    
    // Reference to PhotographyType
    photographyType: {
      type: Schema.Types.ObjectId,
      ref: 'PhotographyType',
      required: [true, 'Photography type is required'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
PhotographerSpecialtySchema.index({ photographer: 1 }); // For photographer lookups
PhotographerSpecialtySchema.index({ photographyType: 1 }); // For type lookups
// Unique constraint: one photographer can only have one specialty of each type
PhotographerSpecialtySchema.index(
  { photographer: 1, photographyType: 1 },
  { unique: true }
);

// Create the model
// Prevent re-compilation during hot reload in development
const PhotographerSpecialty: Model<IPhotographerSpecialty> =
  mongoose.models.PhotographerSpecialty ||
  mongoose.model<IPhotographerSpecialty>('PhotographerSpecialty', PhotographerSpecialtySchema);

export default PhotographerSpecialty;


