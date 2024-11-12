import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import * as textToSpeech from "@google-cloud/text-to-speech";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { sql } from "@vercel/postgres";

let options: { credentials: any } | undefined;

function getOptions() {
  if (!options) {
    const base64EncodedCredentials =
      process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;

    const decodedCredentials = Buffer.from(
      base64EncodedCredentials!,
      "base64"
    ).toString("utf8");
    options = {
      credentials: JSON.parse(decodedCredentials),
    };
  }
  return options;
}

const wordSchema = z.object({
  word: z.string(),
  pronunciation: z.string(),
  keyMeanings: z.array(z.string()),
  exampleSentences: z.array(z.string()),
  detailedDescription: z.string(),
  nounPlural: z.string().nullable(),
  verbConjugations: z.string().nullable(),
});

const openai = new OpenAI();
const client = new textToSpeech.TextToSpeechClient(getOptions());
const storage = new Storage(getOptions());

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
    const CorrectedWordSchema = z.object({ correctedWord: z.string() });

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Please check and correct the spelling of the word "${word}". If the word is correct, return it as is.`,
        },
      ],
      response_format: zodResponseFormat(
        CorrectedWordSchema,
        "corrected_word_response"
      ),
    });

    const message = completion.choices[0].message;

    if (message.parsed) {
      const correctedObject = message.parsed;
      word = correctedObject.correctedWord;
    } else if (message.refusal) {
      // Handle refusal
      throw new Error("OpenAI refused to process the request.");
    } else {
      // Handle parsing errors
      throw new Error("Failed to parse OpenAI response.");
    }

    const res = await sql`SELECT * FROM words WHERE word = ${word};`;
    if (res.rows.length > 0) {
      const wordDetails = res.rows[0];

      return NextResponse.json(
        {
          word: wordDetails.word,
          pronunciation: wordDetails.pronunciation,
          keyMeanings: JSON.parse(wordDetails.keymeanings) || [],
          exampleSentences: JSON.parse(wordDetails.examplesentences) || [],
          detailedDescription: wordDetails.detaileddescription || "",
          audioUrl: wordDetails.audiourl || "",
          nounPlural: wordDetails.nounplural || null,
          verbConjugations: wordDetails.verbconjugations || null,
          wordId: wordDetails.id,
        },
        { status: 200 }
      );
    }

    // Get word details from OpenAI
    const completionWordInfo = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Please give detailed information about the '${word}'. Include the following:
          - Pronunciation (using IPA),
          - keyMeanings (main meaning only, expressed in short words),
          - Example sentences,
          - DetailedDescription (useful description of the word. For nouns, please include a description of countability),
          - nounPlural: plural for countable nouns, null otherwise,
          - Verb conjugation: verb (if not null) present participle, past tense, past participle, third person singular present tense, separated by commas and spaces.`,
        },
      ],
      response_format: zodResponseFormat(wordSchema, "word_info"),
    });

    const messageWordInfo = completionWordInfo.choices[0].message;

    if (messageWordInfo.parsed) {
      const object = messageWordInfo.parsed;

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

      const keyMeaningsString = JSON.stringify(object.keyMeanings);
      const exampleSentencesString = JSON.stringify(object.exampleSentences);

      // Insert the word and get the ID of the newly inserted word
      const insertResult = await sql`
        INSERT INTO words (word, pronunciation, keymeanings, examplesentences, detaileddescription, audiourl, nounplural, verbconjugations)
        VALUES(
          ${object.word}, 
          ${object.pronunciation}, 
          ${keyMeaningsString}, 
          ${exampleSentencesString}, 
          ${object.detailedDescription}, 
          ${audioUrl}, 
          ${object.nounPlural}, 
          ${object.verbConjugations}
        )
        RETURNING id;
      `;

      const wordId = insertResult.rows[0].id;

      return NextResponse.json(
        { ...object, audioUrl, wordId },
        { status: 200 }
      );
    } else if (messageWordInfo.refusal) {
      // Handle refusal
      throw new Error("OpenAI refused to provide word information.");
    } else {
      // Handle parsing errors
      throw new Error("Failed to parse OpenAI response for word information.");
    }
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
