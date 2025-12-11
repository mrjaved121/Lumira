/**
 * Message Model
 * Individual messages in conversations
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import { MessageStatus, AttachmentType } from '@/lib/constants/enums';

// TypeScript interface for Message
export interface IMessage extends mongoose.Document {
  _id: Types.ObjectId;
  conversation: Types.ObjectId; // Reference to Conversation (required)
  sender: Types.ObjectId; // Reference to User (required)
  text: string; // Message text (required, max 5000 chars)
  status: MessageStatus; // Message status enum (default: sent)
  readAt?: Date; // Read timestamp
  attachments?: Array<{
    type: AttachmentType;
    url: string;
    filename?: string;
    size?: number;
  }>;
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
    
    // Message text
    text: {
      type: String,
      required: [true, 'Message text is required'],
      maxlength: [5000, 'Message text cannot be more than 5000 characters'],
      trim: true,
    },
    
    // Message status
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.SENT,
      required: true,
    },
    
    // Read timestamp
    readAt: {
      type: Date,
    },
    
    // Message attachments
    attachments: [
      {
        type: {
          type: String,
          enum: Object.values(AttachmentType),
        },
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          trim: true,
        },
        size: {
          type: Number,
          min: [0, 'File size cannot be negative'],
        },
      },
    ],
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
MessageSchema.index({ status: 1 }); // For filtering by status

// Create the model
// Prevent re-compilation during hot reload in development
const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;

