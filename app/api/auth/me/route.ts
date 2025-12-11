/**
 * Get Current User API
 * GET /api/auth/me
 * 
 * This API returns the authenticated user's profile.
 * It requires a valid JWT token in the Authorization header.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { getAuthenticatedUserDocument } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Step 1: Connect to database
    await connectDB();

    // Step 2: Get authenticated user from token
    // This function will:
    // - Extract token from Authorization header
    // - Verify the token
    // - Find user in database
    // - Check if user is active
    const user = await getAuthenticatedUserDocument(request);

    // Step 3: Prepare user object for response (remove sensitive data)
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpire;

    // Step 4: Return user data
    return NextResponse.json(
      {
        success: true,
        data: {
          user: userObject,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle authentication errors
    if (
      error.message === 'No token provided' ||
      error.message === 'Invalid or expired token' ||
      error.message === 'User not found' ||
      error.message === 'User account is suspended'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get user',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}



