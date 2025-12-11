/**
 * Get Current User Profile API
 * GET /api/users/me
 * 
 * This API returns the authenticated user's full profile with all details.
 * This is similar to GET /api/auth/me but may include additional user-specific data.
 * 
 * Difference from /api/auth/me:
 * - /api/auth/me: Basic user info for authentication context
 * - /api/users/me: Full user profile with all details
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { getAuthenticatedUserDocument } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Step 1: Connect to database
    await connectDB();

    // Step 2: Get authenticated user from token
    const user = await getAuthenticatedUserDocument(request);

    // Step 3: Prepare user object for response (remove sensitive data)
    const userObject = user.toObject();
    
    // Remove sensitive fields
    delete userObject.password;
    delete userObject.refreshToken;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpire;

    // Step 4: Return full user profile
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
        error: error.message || 'Failed to get user profile',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}

/**
 * Update User Profile API
 * PUT /api/users/me
 * 
 * This API allows users to update their profile information.
 * All fields are optional - only provided fields will be updated.
 */

import { updateUserProfileSchema } from '@/lib/schemas/user.schema';

export async function PUT(request: NextRequest) {
  try {
    // Step 1: Connect to database
    await connectDB();

    // Step 2: Get authenticated user
    const user = await getAuthenticatedUserDocument(request);

    // Step 3: Parse and validate request body
    const body = await request.json();
    const validatedData = updateUserProfileSchema.parse(body);

    // Step 4: Update user fields (only update provided fields)
    if (validatedData.name !== undefined) {
      user.name = validatedData.name;
    }
    if (validatedData.firstName !== undefined) {
      user.firstName = validatedData.firstName;
    }
    if (validatedData.lastName !== undefined) {
      user.lastName = validatedData.lastName;
    }
    if (validatedData.phone !== undefined) {
      user.phone = validatedData.phone;
    }
    if (validatedData.location !== undefined) {
      if (validatedData.location.city !== undefined) {
        user.location.city = validatedData.location.city;
      }
      if (validatedData.location.province !== undefined) {
        user.location.province = validatedData.location.province;
      }
      if (validatedData.location.country !== undefined) {
        user.location.country = validatedData.location.country;
      }
    }

    // Step 5: Save updated user
    await user.save();

    // Step 6: Prepare response (remove sensitive data)
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpire;

    // Step 7: Return updated user
    return NextResponse.json(
      {
        success: true,
        data: {
          user: userObject,
        },
        message: 'Profile updated successfully',
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
        error: error.message || 'Failed to update profile',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}

