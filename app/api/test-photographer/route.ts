/**
 * Test API route for Photographer model
 * Visit: http://localhost:3000/api/test-photographer
 */

import connectDB from '@/lib/db/mongoose';
import { Photographer } from '@/lib/models';

export async function GET() {
  try {
    // Connect to database
    await connectDB();
    
    // Test: Count photographers (should be 0 initially)
    const count = await Photographer.countDocuments();
    
    // Test: Get the schema structure
    const schema = Photographer.schema;
    const paths = schema.paths;
    
    return Response.json({
      success: true,
      message: 'Photographer model is working! ✅',
      photographerCount: count,
      schemaFields: Object.keys(paths),
      note: 'This confirms the model is properly set up. Next step: Add more fields!',
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error.message || 'Something went wrong',
      },
      { status: 500 }
    );
  }
}

