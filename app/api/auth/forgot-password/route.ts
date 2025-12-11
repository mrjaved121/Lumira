/**
 * Forgot Password API
 * POST /api/auth/forgot-password
 * 
 * This API allows users to request a password reset email.
 * It generates a reset token and saves it to the user's account.
 * In production, this token would be sent via email.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { User } from '@/lib/models';
import { forgotPasswordSchema } from '@/lib/schemas/auth.schema';
import { generateResetPasswordToken } from '@/lib/utils/jwt';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Connect to database
    await connectDB();

    // Step 2: Parse and validate request body
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    // Step 3: Find user by email
    const user = await User.findOne({ email: validatedData.email });

    // Step 4: Always return success message (security best practice)
    // Don't reveal if email exists or not to prevent email enumeration
    // But only generate token if user exists
    if (user) {
      // Generate reset token
      const resetToken = generateResetPasswordToken();
      
      // Hash the token before storing (using crypto, not bcrypt for speed)
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Set reset token and expiration (10 minutes from now)
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      await user.save({ validateBeforeSave: false });

      // TODO: In production, send email with reset link
      // Example: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
      // For now, we'll just log it in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Password reset token:', resetToken);
        console.log('Reset link:', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`);
      }
    }

    // Step 5: Return success response (always, for security)
    return NextResponse.json(
      {
        success: true,
        message: 'If an account with that email exists, a password reset email has been sent.',
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
        error: error.message || 'Failed to process password reset request',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}



