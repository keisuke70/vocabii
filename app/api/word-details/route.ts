import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import * as textToSpeech from "@google-cloud/text-to-speech";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { sql } from "@vercel/postgres";

let options: { credentials: any } | undefined;

function getOptions() {
  if (!options) {
    const base64EncodedCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;

    const decodedCredentials = Buffer.from(base64EncodedCredentials!, "base64").toString("utf8");
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
        },
        { status: 200 }
      );
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: wordSchema,
      prompt: `Please give detailed information about the '${word}'. Include the following:
      - Pronunciation (using IPA),
      - keyMeanings (main meaning only, expressed in short words),
      - Example sentences,
      - DetailedDescription (useful description of the word. For nouns, please include a description of countability),
      - nounPlural: plural for countable nouns, null otherwise,
      - Verb conjugation: verb (if not null) present participle, past tense, past participle, third person singular present tense, separated by commas and spaces.`,
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

    const keyMeaningsString = JSON.stringify(object.keyMeanings);
    const exampleSentencesString = JSON.stringify(object.exampleSentences);

    await sql`insert into words (word, pronunciation, keymeanings, examplesentences, detaileddescription, audiourl, nounplural, verbconjugations)
    VALUES( 
    ${object.word}, ${object.pronunciation}, ${keyMeaningsString},${exampleSentencesString},${object.detailedDescription},${audioUrl},${object.nounPlural},${object.verbConjugations})`;

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
