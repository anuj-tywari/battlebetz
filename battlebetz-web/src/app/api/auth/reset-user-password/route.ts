import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }
    
    // Reset the password using Supabase Auth API directly
    const { error } = await supabase.auth.resetPasswordForEmail(token, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login?reset=success`,
    });
    
    if (error) {
      console.error('Error resetting password:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });
    
    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
} 