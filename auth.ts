import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";
import { z } from "zod";
import type { User } from "@/lib/definitions";
import { authConfig } from "./auth.config";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
          if (passwordsMatch) {
            return {
              ...user, // Ensure all user fields, including stripe_customer_id, are returned
            };
          }
        }
        return null;
      },
    }),
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
        const stripeCustomer = await stripe.customers.create({
          email: user.email,
          name: user.name ?? undefined,
        });
        const provider = account?.provider ?? null;
        const providerAccountId = profile?.id ?? null;

        const newUser = await sql`
          INSERT INTO users (name, email, verified, provider, provider_account_id, stripe_customer_id)
          VALUES (${user.name}, ${user.email}, true, ${provider}, ${providerAccountId}, ${stripeCustomer.id})
          RETURNING *;
        `;
        user.id = newUser.rows[0].id;
        user.stripeCustomerId = stripeCustomer.id; // Add stripe_customer_id to the user object
      } else {
        user.id = existingUser.id;
        user.stripeCustomerId = existingUser.stripe_customer_id;

        if (!existingUser.stripe_customer_id) {
          const stripeCustomer = await stripe.customers.create({
            email: user.email,
            name: user.name ?? undefined,
          });

          await sql`
            UPDATE users
            SET stripe_customer_id = ${stripeCustomer.id}
            WHERE id = ${existingUser.id};
          `;
          user.stripeCustomerId = stripeCustomer.id; // Update the user object
        }
      }

      return true; // Continue the sign-in process
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id; // User ID
        token.stripeCustomerId = user.stripeCustomerId; // Assign stripe_customer_id
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string; // Expose the ID in the session
      session.user.stripeCustomerId = token.stripeCustomerId as string; // Expose Stripe customer ID in the session
      return session;
    },
  },
});
