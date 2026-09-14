import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { supabase, getServiceRoleClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
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

    // Get service role client for direct DB operations
    const supabaseAdmin = await getServiceRoleClient();

    // Update user status to false (inactive)
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        status: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error deactivating account:', updateError);
      return NextResponse.json(
        { error: 'Failed to deactivate account' },
        { status: 500 }
      );
    }

    // Also invalidate auth sessions for the user
    // This will log them out across all devices
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('Error invalidating sessions:', authError);
      // Not critical, still consider the account deactivated
    }

    return NextResponse.json(
      { success: true, message: 'Account successfully deactivated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in delete account API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 