import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";
import { z } from "zod";
import type { User } from "@/lib/definitions";
import { authConfig } from "./auth.config";

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
    // Google OAuth login
    Google,
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user || !user.email) {
        console.error("Required data is missing during sign-in.");
        return false;
      }

      const existingUser = await getUser(user.email);

      if (!existingUser) {
        // Create the new user in the database
        const provider = account?.provider ?? null;
        const providerAccountId = profile?.id ?? null;

        const newUser = await sql`
          INSERT INTO users (name, email, verified, provider, provider_account_id)
          VALUES (${user.name}, ${user.email}, true, ${provider}, ${providerAccountId})
          RETURNING *;
        `;
        user.id = newUser.rows[0].id;
      } else {
        // If user exists, use their existing ID
        user.id = existingUser.id;
        4;
      }

      return true; // Continue the sign-in process
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add database user ID to the JWT token
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string; // Expose the ID in the session
      return session;
    },
  },
});
