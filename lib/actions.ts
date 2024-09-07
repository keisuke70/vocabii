"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { auth } from "@/auth";
import { sql, db, VercelPoolClient } from "@vercel/postgres";
import format from "pg-format";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import { EmailTemplate } from "@/app/ui/standalone/email-template";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { unstable_noStore as noStore } from "next/cache";

const WordFormSchema = z.object({
  wordId: z.string().uuid(),
  priority: z.number().int(),
  customPronunciation: z.string().nullable().optional(),
  customKeyMeanings: z.array(z.string()).nullable().optional(),
  customExampleSentences: z.array(z.string()).nullable().optional(),
  customDetailedDescription: z.string().nullable().optional(),
  customAudioUrl: z.string().nullable().optional(),
  customNounPlural: z.string().nullable().optional(),
  customVerbConjugations: z.string().nullable().optional(),
});

export type State = {
  errors?: {
    wordId?: string[];
    priority?: string[];
    customPronunciation?: string[];
    customKeyMeanings?: string[];
    customExampleSentences?: string[];
    customDetailedDescription?: string[];
    customAudioUrl?: string[];
    customNounPlural?: string[];
    customVerbConjugations?: string[];
  };
  message?: string | null;
};

export async function addWord(prevState: State, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  const parsedPriority = parseInt(formData.get("priority") as string, 10);

  const validatedFields = WordFormSchema.safeParse({
    wordId: formData.get("wordId"),
    priority: parsedPriority,
    customPronunciation: formData.get("customPronunciation"),
    customKeyMeanings: formData.getAll("customKeyMeanings"),
    customExampleSentences: formData.getAll("customExampleSentences"),
    customDetailedDescription: formData.get("customDetailedDescription"),
    customAudioUrl: formData.get("customAudioUrl"),
    customNounPlural: formData.get("customNounPlural"),
    customVerbConjugations: formData.get("customVerbConjugations"),
  });

  console.log("Validation result:", validatedFields);

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
    };
  }

  // Prepare data for insertion into the database
  const {
    wordId,
    priority,
    customPronunciation,
    customKeyMeanings,
    customExampleSentences,
    customDetailedDescription,
    customAudioUrl,
    customNounPlural,
    customVerbConjugations,
  } = validatedFields.data;


  const customKeyMeaningsString = customKeyMeanings && customKeyMeanings.length > 0 ? JSON.stringify(customKeyMeanings) : null;
  const customExampleSentencesString = customExampleSentences && customExampleSentences.length > 0 ? JSON.stringify(customExampleSentences) : null; 
  const client = await db.connect();
  try {
    // Check if the user already has a custom entry for this word
    const checkUserWordQuery = format(
      `SELECT 1 FROM userwords WHERE user_id = %L AND word_id = %L;`,
      userId,
      wordId
    );
    
    const existingUserWordResult = await client.query(checkUserWordQuery);

    if (existingUserWordResult.rowCount > 0) {
      // Update the existing UserWords entry
      const updateUserWordQuery = format(
        `
        UPDATE userwords 
        SET 
          custom_pronunciation = COALESCE(%L, custom_pronunciation),
          custom_key_meanings = COALESCE(%L, custom_key_meanings),
          custom_example_sentences = COALESCE(%L, custom_example_sentences),
          custom_detailed_description = COALESCE(%L, custom_detailed_description),
          custom_audio_url = COALESCE(%L, custom_audio_url),
          custom_noun_plural = COALESCE(%L, custom_noun_plural),
          custom_verb_conjugations = COALESCE(%L, custom_verb_conjugations)
        WHERE user_id = %L AND word_id = %L;
        `,
        customPronunciation,
        customKeyMeaningsString,
        customExampleSentencesString,
        customDetailedDescription,
        customAudioUrl,
        customNounPlural,
        customVerbConjugations,
        userId,
        wordId
      );
      await client.query(updateUserWordQuery);
    } else {
      // Insert a new UserWords entry
      const insertUserWordQuery = format(
        `
        INSERT INTO userwords (
          user_id, word_id, custom_pronunciation, custom_key_meanings, 
          custom_example_sentences, custom_detailed_description, 
          custom_audio_url, custom_noun_plural, custom_verb_conjugations
        ) VALUES (
          %L, %L, %L, %L, %L, %L, %L, %L, %L
        );
        `,
        userId,
        wordId,
        customPronunciation,
        customKeyMeaningsString,
        customExampleSentencesString,
        customDetailedDescription,
        customAudioUrl,
        customNounPlural,
        customVerbConjugations
      );
      await client.query(insertUserWordQuery);
    }

    // Insert or update the UserWordSets entry
    const insertOrUpdateUserWordSetQuery = format(
      `
      INSERT INTO userwordsets (user_id, word_id, priority, created_at)
      VALUES (%L, %L, %L, NOW())
      ON CONFLICT (user_id, word_id) 
      DO UPDATE SET priority = %L;
      `,
      userId,
      wordId,
      priority,
      priority
    );
    await client.query(insertOrUpdateUserWordSetQuery);
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to add word.",
    };
  } finally {
    client.release();
  }

  // Revalidate the cache for the dashboard page and redirect the user.
  revalidatePath("/dashboard");
  redirect("/dashboard");
}



export async function updateWordPriority(wordId: number, priority: number) {
  const session = await auth();
  const userId = session?.user?.id;
  const userTableName = `user_words_${userId}`;
  const client = await db.connect();

  try {
    const updateQuery = format(
      `UPDATE %I SET priority = %L WHERE id = %L;`,
      userTableName,
      priority,
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
      return "Invalid credentials. Please try again.";
    }
    throw error;
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (
  to: string,
  verificationLink: string,
  userName: string
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "SendOnly@mail.vocabii.com",
      to: to,
      subject: "Verify your email address",
      react: EmailTemplate({ userName, verificationLink }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const SALT = process.env.SALT;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(ENCRYPTION_KEY!, SALT!, 32) as Buffer;
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    key as unknown as Uint8Array,
    iv as unknown as Uint8Array
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export async function signup(
  prevState: string | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const userName = formData.get("name") as string;
  const encryptedPassword = encrypt(password);

  const verificationToken = uuidv4();
  const verificationLink = `https://vocabii.com/api/verify?token=${verificationToken}`;

  // Check if the email already exists
  const existingUser = await sql`select * from users where email = ${email};`;

  if (existingUser.rows.length > 0) {
    return `This email is already used`;
  }

  await sql`insert into users (name, email, password, verification_token) values( ${userName}, ${email}, ${encryptedPassword}, ${verificationToken}); `;

  try {
    const result = await sendEmail(email, verificationLink, userName);
  } catch (error) {
    console.error("Failed to send email:", error);
  }

  redirect("/verification-pending");
}

export async function googleAuthenticate() {
  await signIn("google");
}

export async function fetchRemovedWord() {
  noStore();
  const session = await auth();
  const userId = session?.user?.id;
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

export async function deleteSelected(wordIds: number[]) {
  const session = await auth();
  const userId = session?.user?.id;
  const userTableName = `user_words_${userId}`;
  const client = await db.connect();

  try {
    const deleteQuery = format(
      `DELETE FROM %I WHERE id IN (%L);`,
      userTableName,
      wordIds
    );

    await client.query(deleteQuery);

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
