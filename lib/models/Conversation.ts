/**
 * Conversation Model
 * Message thread container between client and photographer
 * Based on Figma ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';

// TypeScript interface for Conversation
export interface IConversation extends mongoose.Document {
  _id: Types.ObjectId;
  booking?: Types.ObjectId; // Reference to Booking (optional)
  client: Types.ObjectId; // Reference to User (client, required)
  photographer: Types.ObjectId; // Reference to Photographer (required)
  lastMessage?: Types.ObjectId; // Reference to Message
  lastMessageAt?: Date; // Last message timestamp
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const ConversationSchema = new Schema<IConversation>(
  {
    // Reference to Booking (optional)
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    
    // Reference to User (client)
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Conversation must have a client'],
    },
    
    // Reference to Photographer
    photographer: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: [true, 'Conversation must have a photographer'],
    },
    
    // Reference to Message (last message)
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    
    // Last message timestamp
    lastMessageAt: {
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
ConversationSchema.index({ client: 1 }); // For client lookups
ConversationSchema.index({ photographer: 1 }); // For photographer lookups
ConversationSchema.index({ booking: 1 }); // For booking lookups
ConversationSchema.index({ lastMessageAt: -1 }); // Descending for sorting by last message
// Unique constraint: one conversation per client-photographer-booking combination
ConversationSchema.index(
  { client: 1, photographer: 1, booking: 1 },
  { unique: true, sparse: true } // Sparse allows multiple null bookings
);

// Create the model
// Prevent re-compilation during hot reload in development
const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
