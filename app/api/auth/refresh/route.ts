/**
 * Refresh Access Token API
 * POST /api/auth/refresh
 * 
 * This API allows users to get a new access token using their refresh token.
 * This is useful when the access token expires (default: 7 days).
 * 
 * How it works:
 * 1. User sends their refresh token
 * 2. We verify the refresh token is valid
 * 3. We check if the token matches what's stored in the database (security)
 * 4. We generate new access and refresh tokens
 * 5. We save the new refresh token to the database
 * 6. We return both new tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { User } from '@/lib/models';
import { verifyRefreshToken } from '@/lib/utils/jwt';
import { generateToken, generateRefreshToken } from '@/lib/utils/jwt';
import { refreshTokenSchema } from '@/lib/schemas/auth.schema';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Connect to database
    await connectDB();

    // Step 2: Parse and validate request body
    const body = await request.json();
    const validatedData = refreshTokenSchema.parse(body);

    // Step 3: Verify the refresh token
    // This will throw an error if token is invalid or expired
    let decoded;
    try {
      decoded = verifyRefreshToken(validatedData.refreshToken);
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired refresh token',
        },
        { status: 401 }
      );
    }

    // Step 4: Find user by ID from token
    // We need to select refreshToken field (it's excluded by default)
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 401 }
      );
    }

    // Step 5: Check if user account is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Your account has been suspended. Please contact support.',
        },
        { status: 403 }
      );
    }

    // Step 6: Verify the refresh token matches what's stored in database
    // This is a security check - ensures the token hasn't been revoked
    if (user.refreshToken !== validatedData.refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid refresh token. Please login again.',
        },
        { status: 401 }
      );
    }

    // Step 7: Generate new tokens
    const newToken = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Step 8: Save new refresh token to user document
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Step 9: Return new tokens
    return NextResponse.json(
      {
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
        },
        message: 'Token refreshed successfully',
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
        error: error.message || 'Failed to refresh token',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}

