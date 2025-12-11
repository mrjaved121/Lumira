/**
 * User Login API
 * POST /api/auth/login
 * 
 * This API allows users to log in with their email and password.
 * It validates credentials and returns JWT tokens for authentication.
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { User } from '@/lib/models';
import { loginSchema } from '@/lib/schemas/auth.schema';
import { generateToken, generateRefreshToken } from '@/lib/utils/jwt';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Connect to database
    await connectDB();

    // Step 2: Parse and validate request body
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Step 3: Find user by email
    // We need to explicitly select password since it's excluded by default
    const user = await User.findOne({ email: validatedData.email }).select('+password');
    
    // Step 4: Check if user exists
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password', // Don't reveal if email exists
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

    // Step 6: Verify password
    // The User model has a comparePassword method that uses bcrypt
    const isPasswordValid = await user.comparePassword(validatedData.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password', // Same message for security
        },
        { status: 401 }
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

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Login failed',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}



