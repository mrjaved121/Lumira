/**
 * Availability Model
 * Photographer weekly availability schedule
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// Day of week enum (0 = Sunday, 6 = Saturday)
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

// TypeScript interface for Availability
export interface IAvailability extends mongoose.Document {
  _id: Types.ObjectId;
  photographer: Types.ObjectId; // Reference to Photographer (required)
  dayOfWeek: DayOfWeek; // Day of week (0-6, required)
  startTime: string; // Start time (required, HH:MM format)
  endTime: string; // End time (required, HH:MM format)
  isAvailable: boolean; // Available flag (required, default: true)
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const AvailabilitySchema = new Schema<IAvailability>(
  {
    // Reference to Photographer
    photographer: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: [true, 'Availability must be associated with a photographer'],
    },
    
    // Day of week (0 = Sunday, 6 = Saturday)
    dayOfWeek: {
      type: Number,
      required: [true, 'Day of week is required'],
      min: [0, 'Day of week must be between 0 and 6'],
      max: [6, 'Day of week must be between 0 and 6'],
    },
    
    // Start time (HH:MM format)
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'],
    },
    
    // End time (HH:MM format)
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'],
    },
    
    // Available flag
    isAvailable: {
      type: Boolean,
      required: [true, 'Availability status is required'],
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
AvailabilitySchema.index({ photographer: 1 }); // For photographer lookups
AvailabilitySchema.index({ dayOfWeek: 1 }); // For day filtering
// Unique constraint: one photographer can only have one availability slot per day/time
AvailabilitySchema.index(
  { photographer: 1, dayOfWeek: 1, startTime: 1 },
  { unique: true }
);

// Validation: end time must be after start time
AvailabilitySchema.pre('save', function (next) {
  if (this.startTime && this.endTime) {
    const [startHour, startMin] = this.startTime.split(':').map(Number);
    const [endHour, endMin] = this.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) {
      return next(new Error('End time must be after start time'));
    }
  }
  next();
});

// Create the model
// Prevent re-compilation during hot reload in development
const Availability: Model<IAvailability> =
  mongoose.models.Availability ||
  mongoose.model<IAvailability>('Availability', AvailabilitySchema);

export default Availability;


