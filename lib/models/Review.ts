/**
 * Review Model
 * Client ratings and feedback for photographers
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import Photographer from './Photographer';

// TypeScript interface for Review
export interface IReview extends mongoose.Document {
  _id: Types.ObjectId;
  booking: Types.ObjectId; // Reference to Booking (required, unique)
  photographer: Types.ObjectId; // Reference to Photographer (required)
  client: Types.ObjectId; // Reference to User (client, required)
  rating: number; // Rating (1-5, required, INTEGER)
  comment?: string; // Review comment (TEXT)
  isVisible: boolean; // Visibility flag (required, default: true)
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const ReviewSchema = new Schema<IReview>(
  {
    // Reference to Booking (unique - one review per booking)
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Review must be associated with a booking'],
      unique: true,
    },
    
    // Reference to Photographer
    photographer: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: [true, 'Review must be associated with a photographer'],
    },
    
    // Reference to User (client)
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a client'],
    },
    
    // Rating (1-5, integer)
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer',
      },
    },
    
    // Review comment
    comment: {
      type: String,
      trim: true,
    },
    
    // Visibility flag
    isVisible: {
      type: Boolean,
      required: [true, 'Visibility status is required'],
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ReviewSchema.index({ booking: 1 }, { unique: true }); // One review per booking
ReviewSchema.index({ photographer: 1, createdAt: -1 }); // Descending for photographer's reviews
ReviewSchema.index({ rating: 1 }); // For rating filtering
ReviewSchema.index({ isVisible: 1 }); // For visibility filtering

// Function to update photographer average rating
async function updatePhotographerRating(photographerId: Types.ObjectId) {
  try {
    // Get all visible reviews for this photographer
    const ReviewModel = mongoose.model<IReview>('Review');
    const reviews = await ReviewModel.find({
      photographer: photographerId,
      isVisible: true,
    });

    if (reviews.length === 0) {
      // No reviews, set rating to 0
      await Photographer.findByIdAndUpdate(photographerId, {
        averageRating: 0.0,
      });
      return;
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update photographer's average rating (round to 2 decimal places)
    await Photographer.findByIdAndUpdate(photographerId, {
      averageRating: Math.round(averageRating * 100) / 100,
    });
  } catch (error) {
    console.error('Error updating photographer rating:', error);
  }
}

// Post-save hook: Update photographer rating when review is saved
ReviewSchema.post('save', async function (doc) {
  // Only update if review is visible
  if (doc.isVisible) {
    await updatePhotographerRating(doc.photographer);
  }
});

// Post-remove hook: Update photographer rating when review is deleted
ReviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc && doc.photographer) {
    await updatePhotographerRating(doc.photographer);
  }
});

ReviewSchema.post('deleteOne', async function () {
  const doc = await this.model.findOne(this.getQuery());
  if (doc && doc.photographer) {
    await updatePhotographerRating(doc.photographer);
  }
});

// Create the model
// Prevent re-compilation during hot reload in development
const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
