import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    // This should only be available in development mode
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "This endpoint is only available in development mode" },
        { status: 403 }
      );
    }

    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      );
    }

    // Get the user by email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's hashed_password
    const { error: updateError } = await supabase
      .from("users")
      .update({
        hashed_password: hashedPassword,
        status: true
      })
      .eq("id", userData.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    // Also update auth user if needed
    try {
      await supabase.auth.admin.updateUserById(
        userData.id,
        { password: newPassword }
      );
    } catch (authError) {
      console.error("Could not update auth user password:", authError);
      // Continue anyway since we've updated the hashed_password
    }

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 