"use client";

import React, { useEffect, useState } from "react";
import CheckoutPage from "@/app/ui/standalone/checkoutPage";
import { Elements } from "@stripe/react-stripe-js";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const { data: session, status } = useSession();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentType, setIntentType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user?.stripeCustomerId) {
      setErrorMessage("Customer ID is missing. Please log in or sign up.");
      return;
    }

    const customerId = session.user.stripeCustomerId;

    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/create-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            priceId: "price_1PtPes02yr2ZAfqWb75ofVHk",
          }),
        });

        const data = await response.json();

        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setClientSecret(data.clientSecret);
          setIntentType(data.intentType);
          console.log(data.clientSecret);
        }
      } catch (error) {
        console.error("Failed to initialize payment:", error);
        setErrorMessage("Failed to initialize payment. Please try again.");
      }
    };

    fetchClientSecret();
  }, [session, status]);

  const appearance: Appearance = {
    theme: "stripe",
  };

  const options: StripeElementsOptions | undefined = clientSecret
    ? {
        clientSecret,
        appearance,
      }
    : undefined;

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Vocabii</h1>
        <h2 className="text-2xl">
          has requested
          <span className="font-bold"> ¥700</span>
          <span className="text-lg"> /per month</span>
        </h2>
      </div>

      {options ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutPage intentType={intentType} />
        </Elements>
      ) : errorMessage ? (
        <div className="text-red-500">{errorMessage}</div>
      ) : (
        <div className="flex items-center justify-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </main>
  );
}
