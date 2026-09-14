import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check user in database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single();

          if (userError || !userData) {
            return null;
          }
          
          // Check if user account is active 
          if (userData.status === false) {
            throw new Error("Your account has been deactivated or banned. Please contact support.");
          }

          // Try direct Supabase auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });
          
          // If Supabase auth worked, use that
          if (authData?.session) { 
            return {
              id: userData.id,
              email: userData.email,
              name: userData.username || userData.email.split('@')[0],
              role: userData.role || 'USER',
              status: userData.status === true,
            } as any;
          }

          return {
            id: userData.id,
            email: userData.email,
            name: userData.username || userData.email.split('@')[0],
            role: userData.role || 'USER',
            status: userData.status === true,
          } as any;
        } catch (error) {
          throw error;
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).role = token.role;
        (session.user as any).status = token.status;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      
      if (url === baseUrl) return `${baseUrl}/dashboard`;
      
      return baseUrl;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}; 