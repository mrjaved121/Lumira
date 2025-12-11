/**
 * User Logout API
 * POST /api/auth/logout
 * 
 * This API logs out the user by invalidating their refresh token.
 * 
 * How it works:
 * 1. User sends request with access token (to identify who is logging out)
 * 2. We verify the access token
 * 3. We find the user in database
 * 4. We clear the refresh token from database (invalidate it)
 * 5. User is logged out - they'll need to login again to get new tokens
 * 
 * Security Note:
 * - We don't invalidate the access token itself (it will expire naturally)
 * - We invalidate the refresh token so user can't get new access tokens
 * - This is a "soft logout" - access token remains valid until it expires
 * - For "hard logout", you'd need to maintain a token blacklist (more complex)
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { getAuthenticatedUserDocument } from '@/lib/utils/auth';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Connect to database
    await connectDB();

    // Step 2: Get authenticated user from token
    // This verifies the user is logged in and gets their user document
    const user = await getAuthenticatedUserDocument(request);

    // Step 3: Clear refresh token from database
    // This invalidates the refresh token, preventing new token generation
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    // Step 4: Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
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
        error: error.message || 'Logout failed',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}

