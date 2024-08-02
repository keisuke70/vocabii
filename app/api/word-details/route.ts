import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import * as textToSpeech from "@google-cloud/text-to-speech";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { sql } from "@vercel/postgres";
import fs from "fs";


// Decode the base64 encoded GOOGLE_APPLICATION_CREDENTIALS_BASE64
const base64EncodedCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
if (!base64EncodedCredentials) {
  throw new Error("Missing GOOGLE_APPLICATION_CREDENTIALS_BASE64 environment variable");
}

const decodedCredentials = Buffer.from(base64EncodedCredentials, 'base64').toString('utf8');

// Write the JSON content to a temporary file
fs.writeFileSync('./secret.json', decodedCredentials);

const option = {
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
};

const wordSchema = z.object({
  word: z.string(),
  pronunciation: z.string(),
  keyMeanings: z.array(z.string()),
  exampleSentences: z.array(z.string()),
  detailedDescription: z.string(),
});

const client = new textToSpeech.TextToSpeechClient(option);
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucketName = process.env.BUCKET_NAME ?? "";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let word = searchParams.get("word");

  if (!word) {
    return NextResponse.json(
      { error: "Word parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { object: correctedObject } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({ correctedWord: z.string() }),
      prompt: `Please check and correct the spelling of the word "${word}". If the word is correct, return it as is.`,
    });

    word = correctedObject.correctedWord;

    const res = await sql`
    SELECT * FROM words WHERE word = ${word};
  `;
  if (res.rows.length > 0) {
    // Return the word details from the database
    const wordDetails = res.rows[0];

    return NextResponse.json({
      word: wordDetails.word,
      pronunciation: wordDetails.pronunciation,
      keyMeanings: JSON.parse(wordDetails.keymeanings) || [],
      exampleSentences: JSON.parse(wordDetails.examplesentences) || [],
      detailedDescription: wordDetails.detaileddescription  || "",
      audioUrl: wordDetails.audiourl || ""
    }, { status: 200 });
  }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: wordSchema,
      prompt: `Provide detailed information for the word "${word}", return the word including pronunciation (based on IPA pronunciation guide), key meaning(s) (main meanings only and express in short words), example sentences, and a detailed description.`,
    });

    const request: textToSpeech.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text: word },
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" },
      };

    const [response] = await client.synthesizeSpeech(request);

    const audioContent = response.audioContent as unknown as Buffer;

    if (audioContent.length === 0) {
      throw new Error("Audio content is empty");
    }

    const filename = `${uuidv4()}.mp3`;
    const file = storage.bucket(bucketName).file(filename);

    await file.save(audioContent, {
      contentType: "audio/mpeg",
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

    return NextResponse.json(
      { error: `Failed to generate word information: ${errorMessage}` },
      { status: 500 }
    );
  }
}
