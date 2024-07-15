import { db } from '@vercel/postgres';
import { words  } from '@/lib/placeholder-data';

const client = await db.connect();



async function seedWords() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.query(`
      CREATE SEQUENCE IF NOT EXISTS word_order_seq;
    `);
    await client.sql`
      CREATE TABLE IF NOT EXISTS words (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        word TEXT UNIQUE,
        pronunciation TEXT,
        keyMeanings TEXT[],
        exampleSentences TEXT[],
        detailedDescription TEXT,
        "order" INT DEFAULT nextval('word_order_seq')
      );
    `;

    const insertedWords = await Promise.all(
      words.map(async (word) => {
        return client.sql`
          INSERT INTO words (word, pronunciation, keyMeanings, exampleSentences, detailedDescription)
          VALUES (
            ${word.word},
            ${word.pronunciation},
            ARRAY[${word.keyMeanings.map(km => `'${km}'`).join(', ')}]::TEXT[],
            ARRAY[${word.exampleSentences.map(es => `'${es}'`).join(', ')}]::TEXT[],
            ${word.detailedDescription}
          )
          ON CONFLICT (word) DO NOTHING;
        `;
      })
    );

    return insertedWords;
  } catch (error) {
    console.error('Error seeding words:', error);
    throw error;
  }
}




export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedWords();
    await client.sql`COMMIT`;
    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
