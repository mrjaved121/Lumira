/**
 * Photographer Model
 * Extended profile for photographers with business details
 * 
 * STEP 1: Basic structure with core fields
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for Photographer
export interface IPhotographer extends mongoose.Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; // Reference to User (required, unique)
  bio?: string; // Biography (max 1000 chars)
  specialties: string[]; // Photography specialties (required, min 1)
  isVerified: boolean;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
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

// Create the model
// Prevent re-compilation during hot reload in development
const Photographer: Model<IPhotographer> =
  mongoose.models.Photographer ||
  mongoose.model<IPhotographer>('Photographer', PhotographerSchema);

export default Photographer;

