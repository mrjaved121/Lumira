/**
 * BlockedDate Model
 * Specific dates when photographer is unavailable
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for BlockedDate
export interface IBlockedDate extends mongoose.Document {
  _id: Types.ObjectId;
  photographer: Types.ObjectId; // Reference to Photographer (required)
  date: Date; // Blocked date (required)
  reason?: string; // Reason for blocking (max 255 chars)
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const BlockedDateSchema = new Schema<IBlockedDate>(
  {
    // Reference to Photographer
    photographer: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: [true, 'Blocked date must be associated with a photographer'],
    },
    
    // Blocked date
    date: {
      type: Date,
      required: [true, 'Blocked date is required'],
    },
    
    // Reason for blocking
    reason: {
      type: String,
      maxlength: [255, 'Reason cannot exceed 255 characters'],
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
BlockedDateSchema.index({ photographer: 1 }); // For photographer lookups
BlockedDateSchema.index({ date: 1 }); // For date filtering
// Unique constraint: one photographer can only block a date once
BlockedDateSchema.index(
  { photographer: 1, date: 1 },
  { unique: true }
);

// Validation: date should be in the future or today
BlockedDateSchema.pre('save', function (next) {
  if (this.date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const blockedDate = new Date(this.date);
    blockedDate.setHours(0, 0, 0, 0);
    
    if (blockedDate < today) {
      return next(new Error('Blocked date cannot be in the past'));
    }
  }
  next();
});

// Create the model
// Prevent re-compilation during hot reload in development
const BlockedDate: Model<IBlockedDate> =
  mongoose.models.BlockedDate ||
  mongoose.model<IBlockedDate>('BlockedDate', BlockedDateSchema);

export default BlockedDate;


