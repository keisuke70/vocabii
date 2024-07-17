'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// Define the form schema for adding words
const WordFormSchema = z.object({
  word: z.string().min(1,'Word is required.'),
  pronunciation: z.string().optional(),
  keyMeanings: z.array(z.string()).min(1,'At least one key meaning is required.' ),
  exampleSentences: z.array(z.string()).min(1, 'At least one example sentence is required.' ),
  detailedDescription: z.string().optional(),
});

export type State = {
  errors?: {
    word?: string[];
    pronunciation?: string[];
    keyMeanings?: string[];
    exampleSentences?: string[];
    detailedDescription?: string[];
  };
  message?: string | null;
};

export async function addWord(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = WordFormSchema.safeParse({
    word: formData.get('word'),
    pronunciation: formData.get('pronunciation'),
    keyMeanings: formData.getAll('keyMeanings'),
    exampleSentences: formData.getAll('exampleSentences'),
    detailedDescription: formData.get('detailedDescription'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
    };
  }

  // Prepare data for insertion into the database
  const { word, pronunciation, keyMeanings, exampleSentences, detailedDescription } = validatedFields.data;
  
  const keyMeaningsString = JSON.stringify(keyMeanings);
  const exampleSentencesString = JSON.stringify(exampleSentences);

  // Insert data into the database
  try {
    await sql`
      INSERT INTO words (word, pronunciation, keyMeanings, exampleSentences, detailedDescription)
      VALUES (
        ${word},
        ${pronunciation || null},
        ${keyMeaningsString},
        ${exampleSentencesString},
        ${detailedDescription || null}
      )
      ON CONFLICT (word) DO NOTHING;
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Add word.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard');
  redirect('/dashboard');
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get('email');
		const password = formData.get('password');

    await signIn('credentials', {
      redirect: true,
      redirectTo: '/dashboard',
      email,
      password
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function googleAuthenticate () {
  await signIn("google");
}