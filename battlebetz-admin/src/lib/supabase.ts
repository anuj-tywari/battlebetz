// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Add more informative logging
if (!supabaseUrl || !supabaseKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Supabase credentials are missing:');
    if (!supabaseUrl) console.warn('- NEXT_PUBLIC_SUPABASE_URL is not set');
    if (!supabaseKey) console.warn('- NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    console.warn('Please check your .env.local file');
  } else {
    console.error('Missing required Supabase environment variables. API operations will fail.');
  }
}

// Debug option to use if needed
const DEBUG_MODE = false;

// Create the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-supabase-url.supabase.co', 
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      debug: DEBUG_MODE,
    },
    global: {
      fetch: (...args) => {
        if (DEBUG_MODE && args[0] && typeof args[0] === 'string' && 
            !args[0].includes('auth')) {
          console.log(`[Supabase] Fetching: ${args[0]}`);
        }
        return fetch(...args);
      },
    },
    db: {
      schema: 'public'
    }
  }
);

// Create an authenticated Supabase client with access token
export const createAuthenticatedClient = (accessToken: string) => {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials for authenticated client');
    return supabase;
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
};

// Test connectivity and permissions
export const testSupabaseConnection = async () => {
  try {
    // First check that we have valid credentials
    if (!supabaseUrl || !supabaseKey) {
      return false;
    }
    
    // Check if we can access the database at all
    const { data, error } = await supabase.from('users').select('id', { count: 'exact', head: true });
    
    if (error) {
      // Test if we can at least access metadata to determine if this is an RLS issue
      try {
        // Try a direct test of our users table
        const { data: userTest, error: userTestError } = await supabase
          .from('users')
          .select('id')
          .limit(1);
          
        if (userTestError && DEBUG_MODE) {
          if (userTestError.message.includes('does not exist')) {
            console.log('The users table may not exist in the database');
          }
        }
      } catch (metaError) {
        // Silent failure in production
      }
      
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Export a helper function to initialize Supabase in components
export const initSupabase = () => {
  testSupabaseConnection();
  return supabase;
};
