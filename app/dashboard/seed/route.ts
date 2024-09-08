import { db } from '@vercel/postgres';

const client = await db.connect();
async function createUserWordTables() {
  try {
    // Ensure the uuid extension is enabled
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the UserWords table
    await client.sql`
      CREATE TABLE IF NOT EXISTS UserWords (
        user_id UUID REFERENCES Users(id),
        word_id UUID REFERENCES Words(id),
        custom_pronunciation VARCHAR,
        custom_key_meanings TEXT,
        custom_example_sentences TEXT,
        custom_detailed_description TEXT,
        custom_noun_plural TEXT,
        custom_verb_conjugations TEXT,
        PRIMARY KEY (user_id, word_id)  -- Composite primary key
      );
    `;

    // Create the UserWordSets table
    await client.sql`
      CREATE TABLE IF NOT EXISTS UserWordSets (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES Users(id),
        word_id UUID REFERENCES Words(id),
        priority INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await createUserWordTables();
    await client.sql`COMMIT`;
    return Response.json({ message: 'Tables created successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}


// const client = await db.connect();

// async function seedWords() {
//   try {
//     await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//     await client.sql`
//       CREATE TABLE IF NOT EXISTS words (
//         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//         word TEXT UNIQUE,
//         pronunciation TEXT,
//         keymeanings TEXT,
//         examplesentences TEXT,
//         detaileddescription TEXT,
//         audiourl  TEXT,
//         nounplural TEXT,
//         verbconjugations TEXT
//       );
//     `;
//   } catch (error) {
//     console.error('Error seeding words:', error);
//     throw error;
//   }
// }




// export async function GET() {
//   try {
//     await client.sql`BEGIN`;
//     await seedWords();
//     await client.sql`COMMIT`;
//     return Response.json({ message: 'Database seeded successfully' });
//   } catch (error) {
//     await client.sql`ROLLBACK`;
//     return Response.json({ error }, { status: 500 });
//   }
// }
