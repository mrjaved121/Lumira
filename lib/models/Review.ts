/**
 * Review Model
 * Customer reviews for photographers
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import Photographer from './Photographer';

// TypeScript interface for Review
export interface IReview extends mongoose.Document {
  _id: Types.ObjectId;
  booking: Types.ObjectId; // Reference to Booking (required, unique)
  photographer: Types.ObjectId; // Reference to Photographer (required)
  customer: Types.ObjectId; // Reference to User (customer, required)
  rating: number; // Overall rating (1-5, required)
  title?: string; // Review title (max 200 chars)
  comment: string; // Review text (required, max 1000 chars)
  categories?: {
    professionalism?: number; // Rating (1-5)
    communication?: number; // Rating (1-5)
    quality?: number; // Rating (1-5)
    punctuality?: number; // Rating (1-5)
  };
  isVerified: boolean; // Verified review (default: false)
  isPublic: boolean; // Public visibility (default: true)
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
    
    // Reference to User (customer)
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a customer'],
    },
    
    // Overall rating (1-5)
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    
    // Review title
    title: {
      type: String,
      maxlength: [200, 'Title cannot be more than 200 characters'],
      trim: true,
    },
    
    // Review comment/text
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
      trim: true,
    },
    
    // Category ratings
    categories: {
      professionalism: {
        type: Number,
        min: [1, 'Professionalism rating must be at least 1'],
        max: [5, 'Professionalism rating cannot be more than 5'],
      },
      communication: {
        type: Number,
        min: [1, 'Communication rating must be at least 1'],
        max: [5, 'Communication rating cannot be more than 5'],
      },
      quality: {
        type: Number,
        min: [1, 'Quality rating must be at least 1'],
        max: [5, 'Quality rating cannot be more than 5'],
      },
      punctuality: {
        type: Number,
        min: [1, 'Punctuality rating must be at least 1'],
        max: [5, 'Punctuality rating cannot be more than 5'],
      },
    },
    
    // Verified review status
    isVerified: {
      type: Boolean,
      default: false,
    },
    
    // Public visibility
    isPublic: {
      type: Boolean,
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
ReviewSchema.index({ customer: 1, createdAt: -1 }); // Descending for customer's reviews

// Function to update photographer rating
async function updatePhotographerRating(photographerId: Types.ObjectId) {
  try {
    // Get all public reviews for this photographer
    const ReviewModel = mongoose.model<IReview>('Review');
    const reviews = await ReviewModel.find({
      photographer: photographerId,
      isPublic: true,
    });

    if (reviews.length === 0) {
      // No reviews, set rating to 0
      await Photographer.findByIdAndUpdate(photographerId, {
        rating: 0,
        totalReviews: 0,
      });
      return;
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update photographer's rating and total reviews count
    await Photographer.findByIdAndUpdate(photographerId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error('Error updating photographer rating:', error);
  }
}

// Post-save hook: Update photographer rating when review is saved
ReviewSchema.post('save', async function (doc) {
  // Only update if review is public
  if (doc.isPublic) {
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



