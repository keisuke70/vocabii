import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import * as textToSpeech from "@google-cloud/text-to-speech";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

const wordSchema = z.object({
  word: z.string(),
  pronunciation: z.string(),
  keyMeanings: z.array(z.string()),
  exampleSentences: z.array(z.string()),
  detailedDescription: z.string(),
});

const option = {
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};

const client = new textToSpeech.TextToSpeechClient(option);
const storage = new Storage(option);

const bucketName = process.env.BUCKET_NAME ?? "";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const word = searchParams.get("word");

  if (!word) {
    return NextResponse.json(
      { error: "Word parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: wordSchema,
      prompt: `Provide detailed information for the word "${word}", check the spelling and return the corrected spelling, including pronunciation (based on IPA pronunciation guide), key meaning(s) (main meanings only and express in short words), example sentences, and a detailed description.`,
    });

    const request: textToSpeech.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text: word },
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" },
      };

    const [response] = await client.synthesizeSpeech(request);

    // Check the size and content of the response.audioContent
    const audioContent = response.audioContent as Buffer;
    console.log('Audio content size:', audioContent.length);
    console.log('Audio content (first 100 bytes):', audioContent.slice(0, 100));

    if (audioContent.length === 0) {
      throw new Error('Audio content is empty');
    }

    const filename = `${uuidv4()}.mp3`;
    const file = storage.bucket(bucketName).file(filename);

    await file.save(audioContent, {
      contentType: "audio/mpeg",
      public: true,
    });

    const audioUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;

    return NextResponse.json({ ...object, audioUrl }, { status: 200 });
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    console.error('Error:', errorMessage);
    return NextResponse.json(
      { error: `Failed to generate word information: ${errorMessage}` },
      { status: 500 }
    );
  }
}