/**
 * User Model
 * Base user entity for all platform users (customers, photographers, admins)
 */

import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '@/types/database';
import { UserRole } from '@/lib/constants/enums';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [100, 'First name cannot be more than 100 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [100, 'Last name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      // sparse and unique are defined in index below
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      required: [true, 'Email verification status is required'],
      default: false,
    },
    profilePicture: {
      type: String,
    },
    avatar: {
      type: String,
    },
    location: {
      city: {
        type: String,
        trim: true,
      },
      province: {
        type: String,
        trim: true,
        default: 'Quebec',
      },
      country: {
        type: String,
        trim: true,
        default: 'Canada',
      },
    },
    refreshToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    paymentMethods: [
      {
        type: {
          type: String,
          enum: ['credit_card', 'debit_card', 'bank_account'],
        },
        stripePaymentMethodId: String,
        last4: String,
        expiryMonth: Number,
        expiryYear: Number,
        cardBrand: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      messageNotifications: {
        type: Boolean,
        default: true,
      },
      promotionalEmails: {
        type: Boolean,
        default: false,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      publicProfile: {
        type: Boolean,
        default: true,
      },
      showLocation: {
        type: Boolean,
        default: true,
      },
      showBookingHistory: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });
UserSchema.index({ role: 1 });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash password if it's been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // Hash password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
UserSchema.virtual('fullName').get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.name;
});

// Prevent re-compilation during hot reload in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

