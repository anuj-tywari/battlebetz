import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";
import { supabase } from "@/lib/supabase";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Enable detailed debug logs
const DEBUG = true;

function log(...args: any[]) {
  if (DEBUG) {
    console.log('[AUTH_DEBUG]', ...args);
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          log('Missing credentials');
          throw new Error("Please provide both email and password");
        }

        try {
          log(`🔍 Attempting login for email: ${credentials.email}`);
          
          // First try Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });
          
          if (authError) {
            log('❌ Supabase Auth failed:', authError.message);
            throw new Error("Invalid email or password. Please try again.");
          }
          
          log('✅ Supabase Auth successful');
          
          // Once authenticated, get the user profile
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single();

          // If we can't find a user in the database but auth succeeded
          if (userError || !userData) {
            log('⚠️ User authenticated but profile not found, creating profile...');
            
            // Try to create a basic profile for this user
            if (authData.user && authData.user.id && authData.user.email) {
              try {
                const { data: newUser, error: createError } = await supabase
                  .from('users')
                  .insert({
                    id: authData.user.id,
                    email: authData.user.email,
                    username: authData.user.email.split('@')[0] || 'user',
                    role: 'USER',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    bbz_balance: 100,
                    notifications_enabled: true,
                    private_profile: false,
                    show_winnings: true,
                    show_battle_history: true,
                    status: true,
                  })
                  .select()
                  .single();
                  
                if (createError) {
                  log('❌ Failed to create user profile:', createError);
                } else {
                  log('✅ Created new user profile');
                  return {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.username,
                    role: newUser.role || 'USER',
                    status: true,
                  } as any;
                }
              } catch (createErr) {
                log('❌ Error creating profile:', createErr);
              }
            }
            
            // If profile creation failed, return basic auth user
            return {
              id: authData.user?.id || "",
              email: authData.user?.email || "",
              name: authData.user?.email?.split('@')[0] || 'user',
              role: 'USER',
              status: true
            } as any;
          }
          
          // Check if user account is active
          if (userData.status === false) {
            log('❌ Account deactivated or banned');
            throw new Error("Your account has been deactivated. Please contact support.");
          }
          
          // Return authenticated user with profile data
          const user = {
            id: userData.id,
            email: userData.email,
            name: userData.username || userData.email?.split('@')[0] || 'user',
            role: userData.role || 'USER',
            status: userData.status === true
          };
          
          log('✅ Authentication and profile lookup successful');
          return user as any;
        } catch (error: any) {
          log('❌ Authentication error:', error);
          // Make sure we always throw a user-friendly error
          throw new Error(error?.message || "Invalid email or password. Please try again.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

// Check if we have a secret
if (!process.env.NEXTAUTH_SECRET) {
  console.error('[AUTH_ERROR] NEXTAUTH_SECRET is not defined in environment variables!');
}

// Check if we have a URL
if (!process.env.NEXTAUTH_URL) {
  console.warn('[AUTH_WARN] NEXTAUTH_URL is not defined in environment variables!');
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 