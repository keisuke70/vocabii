import { db } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid'; 

const verificationToken = uuidv4();

const users = [
  {
    name: 'User1',
    email: 'keith235670@gmail.com',
    password: 'yamam1',
    verification_token: verificationToken,
    verified: true
  },
];

const client = await db.connect();

async function seedWords() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
      CREATE TABLE IF NOT EXISTS words (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        word TEXT UNIQUE,
        pronunciation TEXT,
        keymeanings TEXT,
        examplesentences TEXT,
        detaileddescription TEXT,
        audiourl  TEXT,
        nounplural TEXT,
        verbconjugations TEXT
      );
    `;
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
