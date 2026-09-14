import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types/auth';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
const hasSupabaseConfig = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Define auth options separately from the handler
const options: NextAuthOptions = {
  providers: [
    // Always use credentials provider, but change behavior based on environment
    CredentialsProvider({
      name: isDevelopment && !hasSupabaseConfig ? 'Development' : 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: isDevelopment ? "admin@example.com" : "" },
        password: { label: "Password", type: "password", placeholder: isDevelopment ? "any password works" : "" }
      },
      async authorize(credentials) {
        // Auto-authenticate in development mode without Supabase
        if (isDevelopment && !hasSupabaseConfig) {
          console.log('Using development authentication (no Supabase)');
          return {
            id: "dev-user-id",
            email: "admin@example.com",
            name: "Development Admin",
            role: "admin" as UserRole,
            accessToken: "dummy-access-token" // Add dummy token for dev mode
          };
        }
        
        // Regular Supabase authentication
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          console.log(`Attempting to authenticate user: ${credentials.email}`);
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) {
            console.error('Supabase authentication error:', error.message);
            return null;
          }

          if (!data.user) {
            console.error('No user returned from Supabase');
            return null;
          }
          
          console.log(`User authenticated successfully:`, {
            id: data.user.id,
            email: data.user.email,
            metadata: data.user.user_metadata
          });

          // Enhanced logging for debugging
          console.log('User authenticated with Supabase:');
          console.log('User ID:', data.user.id);
          console.log('Email:', data.user.email);
          console.log('User metadata:', JSON.stringify(data.user.user_metadata, null, 2));
          
          // Check if user has admin permissions based on role
          const userRole = data.user.user_metadata?.role as UserRole || 'consumer';
          console.log('Detected role:', userRole);
          console.log('Is role from metadata:', !!data.user.user_metadata?.role);
          console.log('Using fallback consumer role:', !data.user.user_metadata?.role);
          
          const isAllowed = ['admin', 'internal', 'promoter', 'comp-owner'].includes(userRole);

          console.log('Is allowed to access admin panel:', isAllowed);
          
          if (!isAllowed) {
            console.error('User does not have admin permissions. Role:', userRole);
            return null;
          }

          return {
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name || "Admin User",
            role: userRole,
            accessToken: data.session?.access_token // Include the Supabase access token
          };
        } catch (e) {
          console.error('Authentication error:', e);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Add the access token to the JWT token
        if (user.accessToken) {
          token.accessToken = user.accessToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        // Add access token to the session
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle sign-out redirection
      if (url.includes('/api/auth/signout') || url.includes('/signout')) {
        // Always redirect to /login after signout
        return '/login?signout=true';
      }
      // Default redirect behavior
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  // Debug mode for development
  debug: isDevelopment,
};

// Create and export the handler
const handler = NextAuth(options);

export { handler as GET, handler as POST }; 