/**
 * Google OAuth Login/Register API
 * POST /api/auth/google
 * 
 * This API allows users to log in or register using Google OAuth.
 * It handles both new user registration and existing user login.
 * If a user exists with the same email but different auth method,
 * it will link the Google account to that user.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { User } from '@/lib/models';
import { googleOAuthSchema } from '@/lib/schemas/auth.schema';
import { generateToken, generateRefreshToken } from '@/lib/utils/jwt';
import { UserRole } from '@/lib/constants/enums';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Connect to database
    await connectDB();

    // Step 2: Parse and validate request body
    const body = await request.json();
    const validatedData = googleOAuthSchema.parse(body);

    // Step 3: Check if user exists by googleId
    let user = await User.findOne({ googleId: validatedData.googleId });

    // Step 4: If user doesn't exist by googleId, check by email
    // This handles the case where user registered with email/password first
    if (!user) {
      user = await User.findOne({ email: validatedData.email });

      // If user exists by email, link the Google account
      if (user) {
        // Check if another user already has this googleId (shouldn't happen, but safety check)
        const existingGoogleUser = await User.findOne({ googleId: validatedData.googleId });
        if (existingGoogleUser) {
          return NextResponse.json(
            {
              success: false,
              error: 'This Google account is already linked to another user',
            },
            { status: 400 }
          );
        }

        // Link Google account to existing user
        user.googleId = validatedData.googleId;
        
        // Update profile picture if provided and not already set
        if (validatedData.profilePicture && !user.profilePicture) {
          user.profilePicture = validatedData.profilePicture;
        }
        
        // Update name and firstName/lastName if not set
        if (validatedData.name && !user.name) {
          user.name = validatedData.name;
          // Try to split name into firstName/lastName if not set
          if (!user.firstName || !user.lastName) {
            const nameParts = validatedData.name.trim().split(/\s+/);
            if (nameParts.length >= 2) {
              user.firstName = nameParts[0];
              user.lastName = nameParts.slice(1).join(' ');
            } else {
              user.firstName = nameParts[0] || validatedData.name;
              user.lastName = '';
            }
          }
        }

        await user.save();
      }
    }

    // Step 5: If user still doesn't exist, create a new user
    if (!user) {
      // Split name into firstName and lastName
      const nameParts = validatedData.name ? validatedData.name.trim().split(/\s+/) : [];
      const firstName = nameParts.length > 0 ? nameParts[0] : '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      user = await User.create({
        googleId: validatedData.googleId,
        email: validatedData.email,
        name: validatedData.name || `${firstName} ${lastName}`.trim() || 'User',
        firstName: firstName || 'User',
        lastName: lastName || '',
        profilePicture: validatedData.profilePicture,
        // No password needed for OAuth users
        role: UserRole.CUSTOMER, // Default role
        emailVerified: true, // Google OAuth emails are verified
      });
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

    // Step 7: Generate JWT tokens
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Step 8: Save refresh token to user document
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Step 9: Prepare user object for response (remove sensitive data)
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    // Step 10: Return success response with tokens
    return NextResponse.json(
      {
        success: true,
        data: {
          user: userObject,
          token,
          refreshToken,
        },
        message: 'Login successful',
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

    // Handle duplicate email/googleId error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          error: `User with this ${field === 'email' ? 'email' : 'Google account'} already exists`,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Google OAuth login failed',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}

