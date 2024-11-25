"use client";

import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

interface CheckoutPageProps {
  intentType: string | null;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ intentType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);



    console.log(intentType);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      console.error("Stripe has not loaded yet. Please try again.");
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      console.error("Error during element submission:", submitError.message);
      setLoading(false);
      return;
    }

    let error;

    if (intentType === "setup") {
      // Confirm a SetupIntent
      ({ error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `http://localhost:3000/dashboard/subscription-success`,
        },
      }));
    } else {
      // Confirm a PaymentIntent
      ({ error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `http://localhost:3000/dashboard/subscription-success`,
        },
      }));
    }

    if (error) {
      console.error(`Error confirming ${intentType}:`, error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? "Subscribe Now" : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;
