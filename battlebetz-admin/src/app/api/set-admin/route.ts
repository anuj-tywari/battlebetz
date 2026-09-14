import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { setUserAsAdmin } from '@/services/directApiService';

// This is a TEMPORARY endpoint for development purposes ONLY
// It should be removed before deploying to production
export async function POST(request: NextRequest) {
  try {
    // Parse request
    const data = await request.json();
    const { email } = data;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // First try the direct API approach
    try {
      const user = await setUserAsAdmin(email);
      if (user) {
        return NextResponse.json({ 
          success: true, 
          message: `User ${email} successfully set as admin via direct API`,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            is_admin: user.is_admin
          }
        });
      }
    } catch (directApiError) {
      console.log('Direct API failed, falling back to SDK:', directApiError);
      // Continue to SDK approach
    }
    
    // Fall back to SDK approach
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('id, email, username, role, is_admin')
      .eq('email', email)
      .limit(1);
    
    if (findError) {
      throw new Error(`Error finding user: ${findError.message}`);
    }
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: `No user found with email: ${email}` },
        { status: 404 }
      );
    }
    
    const user = users[0];
    
    // Update the user's role to admin
    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({ role: 'admin', is_admin: true, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select();
    
    if (updateError) {
      throw new Error(`Error updating user: ${updateError.message}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `User ${email} successfully set as admin via SDK`,
      user: updated[0]
    });
    
  } catch (error: any) {
    console.error('Error in set-admin API:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 