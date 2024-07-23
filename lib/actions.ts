"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { auth } from "@/auth";
import { db, VercelPoolClient } from "@vercel/postgres";
import format from "pg-format";

// Define the form schema for adding words
const WordFormSchema = z.object({
  word: z.string().min(1, "Word is required."),
  pronunciation: z.string().optional(),
  keyMeanings: z
    .array(z.string())
    .min(1, "At least one key meaning is required."),
  exampleSentences: z
    .array(z.string())
    .min(1, "At least one example sentence is required."),
  detailedDescription: z.string().optional(),
  audioUrl: z.string().optional(),
});

export type State = {
  errors?: {
    word?: string[];
    pronunciation?: string[];
    keyMeanings?: string[];
    exampleSentences?: string[];
    detailedDescription?: string[];
    audioUrl?: string[];
  };
  message?: string | null;
};

async function ensureUserTable(userId: string, client: VercelPoolClient) {
  
  const tableName = `user_words_${userId}`;

  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.query(`
    CREATE SEQUENCE IF NOT EXISTS word_order_seq;
  `);
  const query = format(
    `
    CREATE TABLE IF NOT EXISTS %I (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      word TEXT UNIQUE,
      pronunciation TEXT,
      keymeanings TEXT,
      examplesentences TEXT,
      detaileddescription TEXT,
      audiourl TEXT,
      "order" INT DEFAULT nextval('word_order_seq')
    );`,
    tableName
  );

  await client.query(query);
  
  return tableName;
}

function sanitizeEmail(email: string) {
  return email.replace(/[^a-zA-Z0-9]/g, "_");
}

export async function addWord(prevState: State, formData: FormData) {
  const session = await auth();
  const userId = sanitizeEmail(session?.user?.email!);

  // Validate form fields using Zod
  const validatedFields = WordFormSchema.safeParse({
    word: formData.get("word"),
    pronunciation: formData.get("pronunciation"),
    keyMeanings: formData.getAll("keyMeanings"),
    exampleSentences: formData.getAll("exampleSentences"),
    detailedDescription: formData.get("detailedDescription"),
    audioUrl: formData.get("audioUrl"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
    };
  }

  // Prepare data for insertion into the database
  const {
    word,
    pronunciation,
    keyMeanings,
    exampleSentences,
    detailedDescription,
    audioUrl,
  } = validatedFields.data;

  const keyMeaningsString = JSON.stringify(keyMeanings);
  const exampleSentencesString = JSON.stringify(exampleSentences);


  const client = await db.connect();

  const userTableName = await ensureUserTable(userId, client);

  const existingWord = await client.query(
    format(`SELECT 1 FROM %I WHERE word = %L;`, userTableName, word)
  );

  if (existingWord.rowCount > 0) {
    redirect("/dashboard");
  }

  // Insert data into the database
  try {
    const insertQuery = format(
      `
      INSERT INTO %I (word, pronunciation, keymeanings, examplesentences, detaileddescription, audiourl)
      VALUES (%L, %L, %L, %L, %L, %L);
      `,
      userTableName,
      word,
      pronunciation,
      keyMeaningsString,
      exampleSentencesString,
      detailedDescription,
      audioUrl
    );
  
    await client.query(insertQuery);
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Add word.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    await signIn("credentials", {
      redirect: true,
      redirectTo: "/dashboard",
      email,
      password,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function googleAuthenticate() {
  await signIn("google");
}
