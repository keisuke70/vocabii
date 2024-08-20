import { db } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";
import format from "pg-format";

function sanitizeEmail(email: string) {
  return email?.replace(/[^a-zA-Z0-9]/g, "_");
}

export async function fetchWord() {
  noStore();
  const session = await auth();
  //id can't be retrived by default and since email is unique for the auth.js,
  //using email for the id.
  const userId = sanitizeEmail(session?.user?.email!);
  const tableName = `user_words_${userId}`;
  try {
    const tableCheckQuery = format(
      `
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = %L
) as exists`,
      tableName
    );
    const client = await db.connect();
    const tableCheckResult = await client.query(tableCheckQuery);

    const tableExists = tableCheckResult.rows[0]?.exists;

    if (!tableExists) {
      // Return an empty array if the table does not exist
      return [];
    }

    // Fetch data from the table if it exists
    const fetchQuery = format(`SELECT * FROM %I WHERE priority != 0`, tableName);
    const data = await client.query(fetchQuery);

    // Parsing keyMeanings to ensure it's an array of strings
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
  const userId = sanitizeEmail(session?.user?.email!);
  const tableName = `user_words_${userId}`;
  try {
    const tableCheckQuery = format(
      `
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = %L
) as exists`,
      tableName
    );
    const client = await db.connect();
    const tableCheckResult = await client.query(tableCheckQuery);

    const tableExists = tableCheckResult.rows[0]?.exists;

    if (!tableExists) {
      return [];
    }

    // Fetch data from the table where priority is 0
    const fetchQuery = format(`SELECT * FROM %I WHERE priority = 0`, tableName);
    const data = await client.query(fetchQuery);

    // Parsing keyMeanings to ensure it's an array of strings
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
