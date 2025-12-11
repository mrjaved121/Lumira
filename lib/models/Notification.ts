/**
 * Notification Model
 * User notifications
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import { NotificationType } from '@/lib/constants/enums';

// TypeScript interface for Notification
export interface INotification extends mongoose.Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; // Reference to User (required)
  type: NotificationType; // Notification type enum (required)
  title: string; // Notification title (required)
  message: string; // Notification message (required)
  actionUrl?: string; // URL for action
  isRead: boolean; // Read status (default: false)
  readAt?: Date; // Read timestamp
  metadata?: Map<string, any>; // Additional metadata
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const NotificationSchema = new Schema<INotification>(
  {
    // Reference to User
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must be associated with a user'],
    },
    
    // Notification type
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: [true, 'Notification type is required'],
    },
    
    // Notification title
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    
    // Notification message
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    
    // URL for action
    actionUrl: {
      type: String,
      trim: true,
    },
    
    // Read status
    isRead: {
      type: Boolean,
      default: false,
    },
    
    // Read timestamp
    readAt: {
      type: Date,
    },
    
    // Additional metadata
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
NotificationSchema.index({ user: 1, createdAt: -1 }); // Descending for user's notifications
NotificationSchema.index({ user: 1, isRead: 1 }); // For filtering unread notifications
NotificationSchema.index({ type: 1 }); // For filtering by type

// Create the model
// Prevent re-compilation during hot reload in development
const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;

