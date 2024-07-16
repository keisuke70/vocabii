import { db } from '@vercel/postgres';

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
        keymeanings TEXT,
        examplesentences TEXT,
        detailedDescription TEXT,
        "order" INT DEFAULT nextval('word_order_seq')
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
