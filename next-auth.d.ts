import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the ID field
      stripeCustomerId?: string; // Add the Stripe customer ID field
      [key: string]: any; // Allow additional properties
    };
  }

  interface User {
    id: string; // Ensure the User object has an ID
    stripeCustomerId?: string; // Add Stripe customer ID
  }
}
