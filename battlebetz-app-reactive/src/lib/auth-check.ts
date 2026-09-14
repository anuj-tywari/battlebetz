/**
 * This file checks that all required authentication environment variables are set
 * It's imported in the main app file to ensure authentication will work properly
 */

if (typeof window === 'undefined') { // Only run on server
  const missingEnvVars = [];

  // Check NextAuth environment variables
  if (!process.env.NEXTAUTH_SECRET) {
    missingEnvVars.push('NEXTAUTH_SECRET');
  }
  
  if (!process.env.NEXTAUTH_URL) {
    missingEnvVars.push('NEXTAUTH_URL');
  }
  
  // Check Supabase environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missingEnvVars.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missingEnvVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  // Log all missing variables
  if (missingEnvVars.length > 0) {
    console.error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
    console.error('Authentication may not work correctly without these variables');
  } else {
    console.log('✅ All authentication environment variables are set');
  }

  // Check optional variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_AUTO_CONFIRM_SIGNUP) {
    console.warn('NEXT_PUBLIC_SUPABASE_AUTO_CONFIRM_SIGNUP is not set, defaulting to false');
  }
}

export {}; 