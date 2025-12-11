/**
 * Authentication Utility Functions
 * Used to protect API routes and extract user information from JWT tokens
 */

import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';
import { User } from '@/lib/models';
import connectDB from '@/lib/db/mongoose';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

/**
 * Extract and verify JWT token from request headers
 * Returns the authenticated user payload or throws an error
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<AuthenticatedUser> {
  // Get token from Authorization header
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.substring(7);

  // Verify token
  const decoded = verifyToken(token);

  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };
}

/**
 * Get full user document from database
 * Useful when you need the complete user object, not just token payload
 */
export async function getAuthenticatedUserDocument(request: NextRequest) {
  // Connect to database
  await connectDB();

  // Get authenticated user from token
  const authUser = await getAuthenticatedUser(request);

  // Find user in database
  const user = await User.findById(authUser.userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new Error('User account is suspended');
  }

  return user;
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRole: string): boolean {
  // Admin can access everything
  if (userRole === 'admin') {
    return true;
  }

  return userRole === requiredRole;
}



