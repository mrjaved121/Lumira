/**
 * Message Model
 * Individual messages within conversations
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for Message
export interface IMessage extends mongoose.Document {
  _id: Types.ObjectId;
  conversation: Types.ObjectId; // Reference to Conversation (required)
  sender: Types.ObjectId; // Reference to User (required)
  content: string; // Message content (required, TEXT)
  isRead: boolean; // Read status (required, default: false)
  readAt?: Date; // Read timestamp
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const MessageSchema = new Schema<IMessage>(
  {
    // Reference to Conversation
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Message must be associated with a conversation'],
    },
    
    // Reference to User (sender)
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a sender'],
    },
    
    // Message content
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    
    // Read status
    isRead: {
      type: Boolean,
      required: [true, 'Read status is required'],
      default: false,
    },
    
    // Read timestamp
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
MessageSchema.index({ conversation: 1, createdAt: -1 }); // Descending for conversation messages
MessageSchema.index({ sender: 1 }); // For finding messages by sender
MessageSchema.index({ conversation: 1, isRead: 1 }); // For unread messages
MessageSchema.index({ createdAt: -1 }); // For date sorting

// Pre-save hook: Set readAt when isRead becomes true
MessageSchema.pre('save', function (next) {
  if (this.isModified('isRead') && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  if (this.isModified('isRead') && !this.isRead) {
    this.readAt = undefined;
  }
  next();
});

// Create the model
// Prevent re-compilation during hot reload in development
const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
