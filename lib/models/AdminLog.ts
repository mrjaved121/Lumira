/**
 * AdminLog Model
 * Admin action logs for audit trail
 * Complete implementation according to ERD
 */

import mongoose, { Schema, Model, Types } from 'mongoose';
import { AdminActionType, EntityType } from '@/lib/constants/enums';

// TypeScript interface for AdminLog
export interface IAdminLog extends mongoose.Document {
  _id: Types.ObjectId;
  admin: Types.ObjectId; // Reference to User (admin, required)
  action: AdminActionType; // Action type enum (required)
  entityType: EntityType; // Entity type enum (required)
  entityId: Types.ObjectId; // Entity ID (required)
  reason?: string; // Action reason
  metadata?: Map<string, any>; // Additional metadata
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const AdminLogSchema = new Schema<IAdminLog>(
  {
    // Reference to User (admin)
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin log must be associated with an admin'],
    },
    
    // Action type
    action: {
      type: String,
      enum: Object.values(AdminActionType),
      required: [true, 'Action type is required'],
    },
    
    // Entity type
    entityType: {
      type: String,
      enum: Object.values(EntityType),
      required: [true, 'Entity type is required'],
    },
    
    // Entity ID
    entityId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Entity ID is required'],
    },
    
    // Action reason
    reason: {
      type: String,
      trim: true,
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
AdminLogSchema.index({ admin: 1, createdAt: -1 }); // Descending for admin's logs
AdminLogSchema.index({ action: 1 }); // For filtering by action type
AdminLogSchema.index({ entityType: 1, entityId: 1 }); // For finding logs by entity

// Create the model
// Prevent re-compilation during hot reload in development
const AdminLog: Model<IAdminLog> =
  mongoose.models.AdminLog || mongoose.model<IAdminLog>('AdminLog', AdminLogSchema);

export default AdminLog;

