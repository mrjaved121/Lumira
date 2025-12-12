/**
 * User Registration API
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { User } from '@/lib/models';
import { registerSchema } from '@/lib/schemas/auth.schema';
import { generateToken, generateRefreshToken } from '@/lib/utils/jwt';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      name: `${validatedData.firstName} ${validatedData.lastName}`, // Concatenate for name field
      email: validatedData.email,
      password: validatedData.password, // Will be hashed by pre-save hook
      role: validatedData.role,
      phone: validatedData.phone,
    });

    // Generate tokens
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

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove password from response
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.refreshToken;

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          user: userObject,
          token,
          refreshToken,
        },
        message: 'User registered successfully',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle duplicate email error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 400 }
      );
    }

    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    const errorStack = error instanceof Error && process.env.NODE_ENV === 'development' ? error.stack : undefined;
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        ...(errorStack && { stack: errorStack }),
      },
      { status: 500 }
    );
  }
}

