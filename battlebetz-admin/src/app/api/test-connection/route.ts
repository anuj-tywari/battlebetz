import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { testDirectApiConnection } from '@/services/directApiService';

export async function GET() {
  try {
    // Test the Supabase SDK connection
    const { data: sdkData, error: sdkError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    // Test the direct API connection
    const directApiResult = await testDirectApiConnection();
    
    return NextResponse.json({
      sdk: {
        success: !sdkError,
        message: sdkError ? sdkError.message : 'SDK connection successful',
        data: sdkData ? `Found ${sdkData.length} records` : null
      },
      directApi: {
        success: directApiResult,
        message: directApiResult ? 'Direct API connection successful' : 'Direct API connection failed'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error testing connection:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 