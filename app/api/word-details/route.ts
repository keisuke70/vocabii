import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';

const wordSchema = z.object({
  word: z.string(),
  pronunciation: z.string(),
  keyMeanings: z.array(z.string()),
  exampleSentences: z.array(z.string()),
  detailedDescription: z.string(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: wordSchema,
      prompt: `Provide detailed information for the word "${word}", check the spelling and return the corrected spelling, including pronunciation (based on IPA pronunciation guide), key meaning(s) (main meanings only and express in short words), example sentences, and a detailed description.`,
    });

    return NextResponse.json(object, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate word information' }, { status: 500 });
  }
}
