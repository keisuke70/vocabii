import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    // Authenticate user and retrieve session
    const session = await auth();

    if (!session || !session.user || !session.user.stripeCustomerId) {
      return NextResponse.json(
        { error: "Unauthorized or missing Stripe customer ID." },
        { status: 401 }
      );
    }

    const customerId = session.user.stripeCustomerId; // Retrieve customerId from session
    const { priceId } = await request.json(); // Retrieve priceId from request body

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId." }, { status: 400 });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: 10, // Specify the number of trial days
      payment_behavior: "default_incomplete", // Delay payment confirmation
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["pending_setup_intent", "latest_invoice.payment_intent"],
    });

    let clientSecret;

    // Determine whether the clientSecret comes from a setup intent or payment intent
    if (subscription.pending_setup_intent) {
      clientSecret = subscription.pending_setup_intent.client_secret;
    } else {
      clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;
    }

    if (!clientSecret) {
      throw new Error("Failed to retrieve client secret from subscription.");
    }

    return NextResponse.json({
      clientSecret: clientSecret,
      intentType: subscription.pending_setup_intent ? "setup" : "payment",
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription. Please try again." },
      { status: 500 }
    );
  }
}
