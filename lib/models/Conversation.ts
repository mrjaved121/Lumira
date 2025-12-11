/**
 * Conversation Model
 * Chat conversations between users
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for Conversation
export interface IConversation extends mongoose.Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[]; // Array of User references (required, min 2)
  booking?: Types.ObjectId; // Reference to Booking (optional)
  lastMessage?: Types.ObjectId; // Reference to Message
  lastMessageAt: Date; // Last message timestamp (default: now)
  unreadCount?: Map<string, number>; // Unread count per user
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const ConversationSchema = new Schema<IConversation>(
  {
    // Array of User references (participants)
    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      required: [true, 'Conversation must have participants'],
      validate: {
        validator: function (v: Types.ObjectId[]) {
          return v.length >= 2; // Must have at least 2 participants
        },
        message: 'Conversation must have at least 2 participants',
      },
    },
    
    // Reference to Booking (optional)
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    
    // Reference to Message (last message)
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    
    // Last message timestamp
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    
    // Unread count per user (Map of userId -> count)
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ConversationSchema.index({ participants: 1 }); // For finding conversations by participants
ConversationSchema.index({ lastMessageAt: -1 }); // Descending for sorting by last message
ConversationSchema.index({ booking: 1 }); // For finding conversations by booking

// Create the model
// Prevent re-compilation during hot reload in development
const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;

