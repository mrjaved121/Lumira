/**
 * Test API route for User model
 * Visit: http://localhost:3000/api/test-user
 */

import connectDB from '@/lib/db/mongoose';
import { User } from '@/lib/models';

export async function GET() {
  try {
    // Connect to database
    await connectDB();
    
    // Test: Count users (should be 0 initially)
    const count = await User.countDocuments();
    
    // Test: Get the schema structure
    const schema = User.schema;
    const paths = schema.paths;
    
    return Response.json({
      success: true,
      message: 'User model is working! ✅',
      userCount: count,
      schemaFields: Object.keys(paths),
      note: 'This confirms the User model is properly set up and connected to the database.',
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error.message || 'Something went wrong',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

