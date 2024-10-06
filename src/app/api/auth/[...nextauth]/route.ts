import { connectDB } from "@/config/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      provider?: string;
    };
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    provider?: string;
  }
}

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 1 * 60,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Please fill in both email and password.");
        }

        const db = await connectDB();
        if (!db) {
          throw new Error("Failed to connect to the database");
        }
        const usersCollection = await db.collection("users");

        const existingUser = await usersCollection.findOne({ email });
        if (!existingUser) {
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!isPasswordValid) {
          throw new Error("Password is incorrect.");
        }

        return {
          id: existingUser._id.toString(),
          email: existingUser.email,
          name: existingUser.name || null,
          role: existingUser.role || "user",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.NEXT_GITHUB_ID as string,
      clientSecret: process.env.NEXT_GITHUB_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.NEXT_FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.NEXT_FACEBOOK_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      const db = await connectDB();
      if (!db) {
        throw new Error("Failed to connect to the database");
      }
      const usersCollection = db.collection("users");

      if (account) {
        const existingUser = await usersCollection.findOne({
          email: token?.email,
        });

        if (existingUser) {
          token.role = existingUser.role || "user";
          token.provider = account.provider;
        } else if (user) {
          await usersCollection.insertOne({
            name: user.name || "",
            email: token?.email,
            role: "user",
            provider: account.provider,
            createdAt: new Date(),
          });
          token.role = "user";
          token.provider = account.provider;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {};
      }

      session.user.role = token?.role || "user";
      session.user.email = token?.email || undefined;
      session.user.name = token?.name || undefined;
      session.user.provider = token?.provider ?? undefined;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as POST, handler as GET };
