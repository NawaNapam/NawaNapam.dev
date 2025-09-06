import type { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import usersModel from "@/models/users.model";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();
        const user = await usersModel.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid credentials");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role || "user", // Add role support
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      let existing = await usersModel.findOne({ email: user.email });
      if (!existing) {
        existing = await usersModel.create({
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account?.provider || "credentials",
          role: "user", // Default role
        });
      }

      (user as User).id = existing._id.toString();
      (user as User).role = existing.role;
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user && user.id) {
        token.id = user.id;
        token.role = user.role || "user";
      }

      // Update token when session is updated
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      // Add timestamp for token validation
      if (!token.iat) {
        token.iat = Math.floor(Date.now() / 1000);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role;
      }

      // Add session metadata
      session.tokenTimestamp = token.iat;

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },

  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Additional security options
  useSecureCookies: process.env.NODE_ENV === "production",

  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User ${user.email} signed in with ${account?.provider}`);
      if (isNewUser) {
        console.log(`New user registered: ${user.email}`);
      }
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`);
    },
  },
};
