import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { supabase, getServiceRoleClient } from '@/lib/supabase';

export async function PATCH(req: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { currentPassword, newPassword } = await req.json();
    
    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Both current and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Get service role client for direct DB operations
    const supabaseAdmin = await getServiceRoleClient();

    // Verify current password through Supabase Auth
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: session.user.email || '',
      password: currentPassword,
    });
    
    if (authError) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update password in auth.users table
    const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );
    
    if (authUpdateError) {
      console.error('Error updating auth password:', authUpdateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Update the updated_at timestamp in users table
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user timestamp:', updateError);
      // Don't fail the request as the main password was updated
    }

    return NextResponse.json(
      { success: true, message: 'Password successfully updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in update password API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 