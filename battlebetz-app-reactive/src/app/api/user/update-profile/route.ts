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
    const data = await req.json();
    
    // Validate the data
    if (!data.username && !data.email && !data.phone) {
      return NextResponse.json(
        { error: 'No data provided for update' },
        { status: 400 }
      );
    }

    // Construct the update object
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (data.username) updateData.username = data.username;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;

    // Get service role client for direct DB operations
    const supabaseAdmin = await getServiceRoleClient();

    // Update user profile
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // If email was updated, also update it in the auth.users table
    if (data.email) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email: data.email }
      );
      
      if (authError) {
        console.error('Error updating auth email:', authError);
        // Continue anyway as the main profile was updated
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Profile successfully updated',
        user: updatedUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in update profile API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 