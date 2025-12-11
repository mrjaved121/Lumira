/**
 * Reset Password API
 * POST /api/auth/reset-password
 * 
 * This API allows users to reset their password using a reset token
 * that was sent to their email via the forgot-password endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { User } from '@/lib/models';
import { resetPasswordSchema } from '@/lib/schemas/auth.schema';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Connect to database
    await connectDB();

    // Step 2: Parse and validate request body
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    // Step 3: Hash the provided token to compare with stored token
    const hashedToken = crypto
      .createHash('sha256')
      .update(validatedData.token)
      .digest('hex');

    // Step 4: Find user with matching token and check expiration
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() }, // Token must not be expired
    }).select('+resetPasswordToken +resetPasswordExpire');

    // Step 5: Check if token is valid
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired reset token',
        },
        { status: 400 }
      );
    }

    // Step 6: Check if user account is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Your account has been suspended. Please contact support.',
        },
        { status: 403 }
      );
    }

    // Step 7: Update password
    // The password will be hashed automatically by the User model's pre-save hook
    user.password = validatedData.password;
    
    // Step 8: Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Step 9: Save user
    await user.save();

    // Step 10: Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle validation errors (Zod)
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to reset password',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}



