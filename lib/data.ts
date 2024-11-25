"use server";
import { db } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";
import format from "pg-format";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function fetchWord() {
  noStore();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    // Return an empty array if there is no user
    return [];
  }

  try {
    const client = await db.connect();

    // Updated query using pg-format for SQL injection protection
    const fetchQuery = format(
      `
      SELECT 
        w.id,
        w.word,
        COALESCE(uw.custom_pronunciation, w.pronunciation) AS pronunciation,
        COALESCE(uw.custom_key_meanings, w.keymeanings) AS keymeanings,
        COALESCE(uw.custom_example_sentences, w.examplesentences) AS examplesentences,
        COALESCE(uw.custom_detailed_description, w.detaileddescription) AS detaileddescription,
        w.audiourl AS audiourl,
        COALESCE(uw.custom_noun_plural, w.nounplural) AS nounplural,
        COALESCE(uw.custom_verb_conjugations, w.verbconjugations) AS verbconjugations,
        uws.priority,
        uws.created_at
      FROM UserWordSets uws
      JOIN Words w ON uws.word_id = w.id
      LEFT JOIN UserWords uw ON uws.word_id = uw.word_id AND uw.user_id = %L
      WHERE uws.user_id = %L
      ORDER BY uws.priority DESC, uws.created_at DESC;
    `,
      userId,
      userId
    );

    const data = await client.query(fetchQuery);

    // Parsing keymeanings and examplesentences to ensure they are arrays of strings
    const words = data.rows.map((word) => ({
      ...word,
      keymeanings: JSON.parse(word.keymeanings),
      examplesentences: JSON.parse(word.examplesentences),
    }));

    return words;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch words.");
  }
}

export async function fetchRemovedWord() {
  noStore();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    // Return an empty array if there is no user
    return [];
  }

  try {
    const client = await db.connect();

    // Updated query using pg-format for SQL injection protection
    const fetchQuery = format(
      `
      SELECT 
        w.id,
        w.word,
        COALESCE(uw.custom_pronunciation, w.pronunciation) AS pronunciation,
        COALESCE(uw.custom_key_meanings, w.keymeanings) AS keymeanings,
        COALESCE(uw.custom_example_sentences, w.examplesentences) AS examplesentences,
        COALESCE(uw.custom_detailed_description, w.detaileddescription) AS detaileddescription,
        w.audiourl AS audiourl,
        COALESCE(uw.custom_noun_plural, w.nounplural) AS nounplural,
        COALESCE(uw.custom_verb_conjugations, w.verbconjugations) AS verbconjugations,
        uws.priority,
        uws.created_at
      FROM UserWordSets uws
      JOIN Words w ON uws.word_id = w.id
      LEFT JOIN UserWords uw ON uws.word_id = uw.word_id AND uw.user_id = %L
      WHERE uws.user_id = %L AND uws.priority = 0
      ORDER BY uws.created_at DESC;
    `,
      userId,
      userId
    );

    const data = await client.query(fetchQuery);

    // Parsing keymeanings and examplesentences to ensure they are arrays of strings
    const removedWords = data.rows.map((word) => ({
      ...word,
      keymeanings: JSON.parse(word.keymeanings),
      examplesentences: JSON.parse(word.examplesentences),
    }));

    return removedWords;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch removed words.");
  }
}

export async function deleteSelected(wordIds: number[]) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      message: "User not authenticated.",
    };
  }

  const client = await db.connect();

  try {
    // Delete entries from UserWords table
    const deleteUserWordsQuery = format(
      `DELETE FROM userwords WHERE user_id = %L AND word_id IN (%L);`,
      userId,
      wordIds
    );

    await client.query(deleteUserWordsQuery);

    // Delete entries from UserWordSets table
    const deleteUserWordSetsQuery = format(
      `DELETE FROM userwordsets WHERE user_id = %L AND word_id IN (%L);`,
      userId,
      wordIds
    );

    await client.query(deleteUserWordSetsQuery);

    return {
      message: "Selected words deleted successfully.",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to delete selected words.",
    };
  } finally {
    client.release();
  }
}

export async function updateWordPriority(wordId: number, priority: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      message: "User not authenticated.",
    };
  }

  const client = await db.connect();

  try {
    // Updated query to set priority in UserWordSets table
    const updateQuery = format(
      `
      UPDATE userwordsets
      SET priority = %L
      WHERE user_id = %L AND word_id = %L;
      `,
      priority,
      userId,
      wordId
    );

    await client.query(updateQuery);

    return {
      message: "Priority updated successfully.",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to update priority.",
    };
  } finally {
    client.release();
  }
}

export async function hasActiveSubscription(): Promise<boolean> {
  noStore(); // Ensure no caching for sensitive operations
  try {
    // Retrieve the authenticated user session
    const session = await auth();
    const customerId = session?.user?.stripeCustomerId;

    if (!customerId) {
      console.error("Customer ID is missing from the session.");
      return false;
    }

    // Fetch subscriptions for the customer from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
    });

    // Check if any subscription has the status 'active' or 'trialing'
    const hasValidSubscription = subscriptions.data.some(
      (subscription: { status: string }) =>
        subscription.status === "active" || subscription.status === "trialing"
    );

    return hasValidSubscription;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
}
